import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';

type TargetType = 'hit' | 'decoy';
type GameView = 'ready' | 'countdown' | 'playing' | 'result' | 'walked';

type Target = {
  id: number;
  type: TargetType;
  x: number;
  y: number;
  size: number;
  color?: string;
  createdAt: number;
  lifetime: number;
  dying?: boolean;
};

type Flash = {
  id: number;
  x: number;
  y: number;
  text: string;
};

type History = {
  pb: number;
  prev: number;
  bestReaction: number | null;
  bestCombo: number;
};

type Result = {
  score: number;
  previousBest: number;
  previousScore: number;
  bestReaction: number | null;
  maxCombo: number;
  hits: number;
  misses: number;
  difficulty: number;
  gameOver: boolean;
};

const DIFFICULTY = [
  { lifetime: 1050, spawnMs: 620, decoyProb: 0.12 },
  { lifetime: 860, spawnMs: 520, decoyProb: 0.26 },
  { lifetime: 720, spawnMs: 430, decoyProb: 0.38 },
  { lifetime: 620, spawnMs: 360, decoyProb: 0.50 },
];

const TARGET_COLORS = ['#C77DFF', '#4DB8FF', '#FFE45E', '#FF4FA3', '#44FFB2', '#FF8A3D'];
const STORAGE_KEY = 'ro_hist';
const ROUND_SECONDS = 60;
const WALK_AWAY_BONUS = 2000;

const createHistory = (): History => ({
  pb: 0,
  prev: 0,
  bestReaction: null,
  bestCombo: 0,
});

export function ReflexOverrideGame() {
  const [view, setView] = useState<GameView>('ready');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(5);
  const [targets, setTargets] = useState<Target[]>([]);
  const [flashes, setFlashes] = useState<Flash[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [urgeAfter, setUrgeAfter] = useState(5);
  const [walkScore, setWalkScore] = useState(0);
  const [shake, setShake] = useState(false);

  const arenaRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const spawnRef = useRef(0);
  const startRef = useRef(0);
  const targetIdRef = useRef(0);
  const flashIdRef = useRef(0);
  const historyRef = useRef<History>(createHistory());
  const statsRef = useRef({
    score: 0,
    combo: 0,
    maxCombo: 0,
    hits: 0,
    misses: 0,
    noMiss: true,
    rts: [] as number[],
    difficulty: 1,
    bombStreak: 0,
    gameOver: false,
  });

  const clearLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const saveHistory = useCallback((history: History) => {
    historyRef.current = history;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Gameplay still works if storage is unavailable.
    }
  }, []);

  const finishRound = useCallback((earlyExit: boolean) => {
    clearLoop();
    setTargets([]);
    const stats = statsRef.current;
    if (!earlyExit) {
      stats.score += 500;
      if (stats.noMiss && stats.hits > 0) stats.score += 1000;
    }

    const history = historyRef.current;
    const bestReaction = stats.rts.length ? Math.min(...stats.rts) : null;
    const nextHistory: History = {
      prev: stats.score,
      pb: Math.max(history.pb, stats.score),
      bestReaction:
        bestReaction === null
          ? history.bestReaction
          : history.bestReaction === null
            ? bestReaction
            : Math.min(history.bestReaction, bestReaction),
      bestCombo: Math.max(history.bestCombo, stats.maxCombo),
    };
    saveHistory(nextHistory);
    setScore(stats.score);
    setCombo(stats.combo);
    setResult({
      score: stats.score,
      previousBest: history.pb,
      previousScore: history.prev,
      bestReaction,
      maxCombo: stats.maxCombo,
      hits: stats.hits,
      misses: stats.misses,
      difficulty: stats.difficulty,
      gameOver: stats.gameOver,
    });
    setUrgeAfter(5);
    setView('result');
  }, [clearLoop, saveHistory]);

  const spawnTarget = useCallback(() => {
    const arena = arenaRef.current;
    if (!arena) return;

    const rect = arena.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;

    const size = 28 + Math.floor(Math.random() * 11);
    let x = 0;
    let y = 0;
    let ok = false;

    for (let tries = 0; tries < 10 && !ok; tries += 1) {
      x = Math.random() * Math.max(1, rect.width - size);
      y = Math.random() * Math.max(1, rect.height - size);
      ok = !targets.some((target) => {
        if (target.dying) return false;
        const dx = x + size / 2 - (target.x + target.size / 2);
        const dy = y + size / 2 - (target.y + target.size / 2);
        return Math.hypot(dx, dy) < (size + target.size) * 0.58;
      });
    }
    if (!ok) return;

    const conf = DIFFICULTY[statsRef.current.difficulty - 1];
    const isDecoy = Math.random() < conf.decoyProb;
    const nextTarget: Target = {
      id: targetIdRef.current += 1,
      type: isDecoy ? 'decoy' : 'hit',
      x,
      y,
      size,
      color: isDecoy ? undefined : TARGET_COLORS[Math.floor(Math.random() * TARGET_COLORS.length)],
      createdAt: performance.now(),
      lifetime: conf.lifetime,
    };
    setTargets((current) => [...current, nextTarget]);
  }, [targets]);

  const loop = useCallback((now: number) => {
    const stats = statsRef.current;
    if (stats.gameOver) return;

    const elapsed = (now - startRef.current) / 1000;
    if (elapsed >= ROUND_SECONDS) {
      finishRound(false);
      return;
    }

    const remaining = Math.max(0, Math.ceil(ROUND_SECONDS - elapsed));
    setTimeLeft(remaining);
    stats.difficulty = Math.min(4, Math.floor(elapsed / 15) + 1);

    if (now >= spawnRef.current) {
      spawnTarget();
      const conf = DIFFICULTY[stats.difficulty - 1];
      spawnRef.current = now + conf.spawnMs + (Math.random() * 180 - 90);
    }

    setTargets((current) => current.filter((target) => {
      if (target.dying) return true;
      const expired = now - target.createdAt > target.lifetime;
      if (!expired) return true;
      if (target.type === 'hit') {
        stats.combo = 0;
        stats.noMiss = false;
        setCombo(0);
      }
      return false;
    }));

    rafRef.current = requestAnimationFrame(loop);
  }, [finishRound, spawnTarget]);

  const startGame = useCallback(() => {
    statsRef.current = {
      score: 0,
      combo: 0,
      maxCombo: 0,
      hits: 0,
      misses: 0,
      noMiss: true,
      rts: [],
      difficulty: 1,
      bombStreak: 0,
      gameOver: false,
    };
    setScore(0);
    setCombo(0);
    setLives(5);
    setTimeLeft(ROUND_SECONDS);
    setTargets([]);
    setFlashes([]);
    setResult(null);
    startRef.current = performance.now();
    spawnRef.current = startRef.current + 400;
    setView('playing');
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const startCountdown = useCallback(() => {
    clearLoop();
    setCountdown(3);
    setView('countdown');
  }, [clearLoop]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      historyRef.current = {
        pb: Number(stored.pb) || 0,
        prev: Number(stored.prev) || 0,
        bestReaction: stored.bestReaction === null || stored.bestReaction === undefined ? null : Number(stored.bestReaction),
        bestCombo: Number(stored.bestCombo) || 0,
      };
    } catch {
      historyRef.current = createHistory();
    }
  }, []);

  useEffect(() => {
    if (view !== 'countdown') return undefined;
    if (countdown <= 0) {
      const timeout = window.setTimeout(startGame, 320);
      return () => window.clearTimeout(timeout);
    }
    const timeout = window.setTimeout(() => setCountdown((value) => value - 1), 600);
    return () => window.clearTimeout(timeout);
  }, [countdown, startGame, view]);

  useEffect(() => clearLoop, [clearLoop]);

  const endWithGameOver = useCallback(() => {
    statsRef.current.gameOver = true;
    clearLoop();
    setShake(true);
    window.setTimeout(() => setShake(false), 300);
    window.setTimeout(() => finishRound(true), 900);
  }, [clearLoop, finishRound]);

  const tapTarget = useCallback((target: Target) => {
    if (view !== 'playing' || target.dying || statsRef.current.gameOver) return;
    const stats = statsRef.current;
    const rt = performance.now() - target.createdAt;

    if (target.type === 'hit') {
      stats.hits += 1;
      stats.combo += 1;
      stats.maxCombo = Math.max(stats.maxCombo, stats.combo);
      stats.rts.push(Math.round(rt));
      const base = rt < 400 ? 150 : rt < 900 ? 100 : 60;
      const points = base + stats.combo * 10;
      stats.score += points;
      setFlashes((current) => [
        ...current,
        { id: flashIdRef.current += 1, x: target.x + target.size / 2, y: target.y + target.size / 2, text: `+${points}` },
      ]);
      window.setTimeout(() => setFlashes((current) => current.slice(1)), 700);
    } else {
      stats.misses += 1;
      stats.noMiss = false;
      stats.combo = 0;
      stats.score = Math.max(0, stats.score - 50);
      stats.bombStreak += 1;
      setShake(true);
      window.setTimeout(() => setShake(false), 300);
    }

    setScore(stats.score);
    setCombo(stats.combo);
    setLives(Math.max(0, 5 - stats.bombStreak));
    setTargets((current) => current.filter((item) => item.id !== target.id));
    if (stats.bombStreak >= 5) endWithGameOver();
  }, [endWithGameOver, view]);

  const missArena = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || view !== 'playing') return;
    const stats = statsRef.current;
    stats.combo = 0;
    stats.noMiss = false;
    stats.score = Math.max(0, stats.score - 10);
    setScore(stats.score);
    setCombo(0);
  }, [view]);

  const walkAway = useCallback(() => {
    const baseScore = result?.score ?? score;
    const total = baseScore + WALK_AWAY_BONUS;
    const history = historyRef.current;
    saveHistory({ ...history, prev: total, pb: Math.max(history.pb, total) });
    setWalkScore(total);
    setView('walked');
  }, [result?.score, saveHistory, score]);

  const accuracy = result ? result.hits + result.misses : 0;
  const timePercent = (timeLeft / ROUND_SECONDS) * 100;

  return (
    <div className="ro-game" aria-label="Playable Reflex Override pivot game">
      {view === 'ready' && (
        <div className="ro-panel ro-ready">
          <span className="ro-mini-label">Reflex Override</span>
          <strong>Pivot out of autopilot with a short reaction round.</strong>
          <button className="ro-play-button" type="button" onClick={startCountdown}>Start 60-second challenge</button>
        </div>
      )}

      {view === 'countdown' && (
        <div className="ro-panel ro-countdown">
          <span>{countdown || 'Go'}</span>
          <small>Get ready</small>
        </div>
      )}

      {view === 'playing' && (
        <div className="ro-panel ro-playing">
          <div className="ro-hud">
            <span><small>Time</small><strong>{timeLeft}</strong></span>
            <span><small>Score</small><strong>{score.toLocaleString()}</strong></span>
            <span><small>Combo</small><strong>{combo}</strong></span>
          </div>
          <div className="ro-time-track"><span style={{ width: `${timePercent}%` }} /></div>
          <div className="ro-lives" aria-label={`${lives} lives remaining`}>
            <small>Lives</small>
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index} className={index < lives ? 'is-on' : ''} />
            ))}
          </div>
          <div
            ref={arenaRef}
            className={`ro-arena${shake ? ' is-shaking' : ''}`}
            onPointerDown={missArena}
            role="application"
            aria-label="Tap targets and avoid bombs"
          >
            {targets.map((target) => (
              <button
                key={target.id}
                type="button"
                className={`ro-target ro-target--${target.type}`}
                style={{
                  left: target.x,
                  top: target.y,
                  width: target.size,
                  height: target.size,
                  background: target.type === 'hit' ? target.color : undefined,
                  color: target.type === 'hit' ? target.color : undefined,
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  tapTarget(target);
                }}
                aria-label={target.type === 'hit' ? 'Hit target' : 'Bomb decoy'}
              >
                {target.type === 'hit' ? (
                  <>
                    <span className="ro-hit-ring" />
                    <span className="ro-hit-dot" />
                  </>
                ) : (
                  <>
                    <span className="ro-bomb-fuse" />
                    <span className="ro-bomb-spark" />
                    <span className="ro-bomb-x">x</span>
                  </>
                )}
              </button>
            ))}
            {flashes.map((flash) => (
              <span key={flash.id} className="ro-combo-flash" style={{ left: flash.x, top: flash.y }}>{flash.text}</span>
            ))}
          </div>
          <button className="ro-end-button" type="button" onClick={() => finishRound(true)}>End early</button>
        </div>
      )}

      {view === 'result' && result && (
        <div className="ro-panel ro-result">
          <div className="ro-result-head">
            <span>{result.gameOver ? 'Game over' : 'Round complete'}</span>
            <small>{result.gameOver ? '5 bombs hit' : `Level ${result.difficulty}`}</small>
          </div>
          <div className="ro-score">{result.score.toLocaleString()}</div>
          <div className="ro-result-grid">
            <span><small>Best reaction</small><strong>{result.bestReaction ? `${result.bestReaction}ms` : '-'}</strong></span>
            <span><small>Longest combo</small><strong>{result.maxCombo}</strong></span>
            <span><small>Hits</small><strong>{result.hits}</strong></span>
            <span><small>Accuracy</small><strong>{accuracy ? `${Math.round((result.hits / accuracy) * 100)}%` : '-'}</strong></span>
          </div>
          <label className="ro-urge">
            <span>Urge now</span>
            <input type="range" min="1" max="10" step="1" value={urgeAfter} onChange={(event) => setUrgeAfter(Number(event.target.value))} />
            <strong>{urgeAfter}/10</strong>
          </label>
          <button className="ro-play-button" type="button" onClick={walkAway}>Walk away +{WALK_AWAY_BONUS}</button>
          <button className="ro-secondary-button" type="button" onClick={startCountdown}>Play again</button>
        </div>
      )}

      {view === 'walked' && (
        <div className="ro-panel ro-walked">
          <span className="ro-mini-label">Walked away</span>
          <strong>That was the right move.</strong>
          <p>You broke the loop and chose to leave. Urge logged at {urgeAfter}/10.</p>
          <small>+{WALK_AWAY_BONUS} walk-away bonus</small>
          <b>{walkScore.toLocaleString()} total</b>
          <button className="ro-secondary-button" type="button" onClick={startCountdown}>Play again later</button>
        </div>
      )}
    </div>
  );
}
