import React, { useState, useEffect, useRef } from 'react';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Bullet extends Entity {
  isPlayerBullet: boolean;
}

interface Enemy extends Entity {
  health: number;
}

export default function SpaceShooter() {
  const [player, setPlayer] = useState<Entity>({
    x: GAME_WIDTH / 2 - 25,
    y: GAME_HEIGHT - 60,
    width: 50,
    height: 50,
    speed: 5
  });
  
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  
  // 处理键盘输入
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
      
      if (e.key === ' ') {
        fireBullet();
      }
      
      if (e.key === 'p') {
        setIsPaused(prev => !prev);
      }
      
      if (e.key === 'r' && gameOver) {
        resetGame();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]);
  
  // 游戏主循环
  useEffect(() => {
    if (gameOver || isPaused) return;
    
    const gameLoop = () => {
      // 移动玩家
      movePlayer();
      
      // 移动子弹
      moveBullets();
      
      // 移动敌人
      moveEnemies();
      
      // 检测碰撞
      checkCollisions();
      
      // 生成敌人
      if (Math.random() < 0.02) {
        spawnEnemy();
      }
    };
    
    const gameInterval = setInterval(gameLoop, 16);
    return () => clearInterval(gameInterval);
  }, [player, bullets, enemies, gameOver, isPaused]);
  
  // 移动玩家
  const movePlayer = () => {
    let newX = player.x;
    let newY = player.y;
    
    if (keysPressed.current.has('ArrowLeft')) {
      newX = Math.max(0, player.x - player.speed);
    }
    if (keysPressed.current.has('ArrowRight')) {
      newX = Math.min(GAME_WIDTH - player.width, player.x + player.speed);
    }
    if (keysPressed.current.has('ArrowUp')) {
      newY = Math.max(0, player.y - player.speed);
    }
    if (keysPressed.current.has('ArrowDown')) {
      newY = Math.min(GAME_HEIGHT - player.height, player.y + player.speed);
    }
    
    if (newX !== player.x || newY !== player.y) {
      setPlayer(prev => ({ ...prev, x: newX, y: newY }));
    }
  };
  
  // 发射子弹
  const fireBullet = () => {
    const newBullet: Bullet = {
      x: player.x + player.width / 2 - 2.5,
      y: player.y,
      width: 5,
      height: 15,
      speed: 7,
      isPlayerBullet: true
    };
    
    setBullets(prev => [...prev, newBullet]);
  };
  
  // 移动子弹
  const moveBullets = () => {
    setBullets(prev => 
      prev
        .map(bullet => ({
          ...bullet,
          y: bullet.isPlayerBullet 
            ? bullet.y - bullet.speed 
            : bullet.y + bullet.speed
        }))
        .filter(bullet => 
          bullet.y > -bullet.height && 
          bullet.y < GAME_HEIGHT
        )
    );
  };
  
  // 生成敌人
  const spawnEnemy = () => {
    const newEnemy: Enemy = {
      x: Math.random() * (GAME_WIDTH - 40),
      y: -50,
      width: 40,
      height: 40,
      speed: 2 + Math.random() * 2,
      health: 1
    };
    
    setEnemies(prev => [...prev, newEnemy]);
  };
  
  // 移动敌人
  const moveEnemies = () => {
    setEnemies(prev => 
      prev
        .map(enemy => ({
          ...enemy,
          y: enemy.y + enemy.speed
        }))
        .filter(enemy => {
          if (enemy.y > GAME_HEIGHT) {
            // 敌人逃脱，游戏结束
            setGameOver(true);
            return false;
          }
          return true;
        })
    );
  };
  
  // 检测碰撞
  const checkCollisions = () => {
    // 检查子弹和敌人的碰撞
    let updatedEnemies = [...enemies];
    let updatedBullets = [...bullets];
    let updatedScore = score;
    
    for (let i = updatedBullets.length - 1; i >= 0; i--) {
      const bullet = updatedBullets[i];
      if (!bullet.isPlayerBullet) continue;
      
      for (let j = updatedEnemies.length - 1; j >= 0; j--) {
        const enemy = updatedEnemies[j];
        
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          // 子弹击中敌人
          updatedEnemies[j] = { ...enemy, health: enemy.health - 1 };
          updatedBullets.splice(i, 1);
          
          if (updatedEnemies[j].health <= 0) {
            updatedEnemies.splice(j, 1);
            updatedScore += 10;
          }
          
          break;
        }
      }
    }
    
    // 检查玩家和敌人的碰撞
    for (const enemy of updatedEnemies) {
      if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
      ) {
        // 玩家碰到敌人，游戏结束
        setGameOver(true);
        return;
      }
    }
    
    setEnemies(updatedEnemies);
    setBullets(updatedBullets);
    setScore(updatedScore);
  };
  
  // 重置游戏
  const resetGame = () => {
    setPlayer({
      x: GAME_WIDTH / 2 - 25,
      y: GAME_HEIGHT - 60,
      width: 50,
      height: 50,
      speed: 5
    });
    setBullets([]);
    setEnemies([]);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">飞机大战</h1>
      <div className="mb-4">
        <span className="mr-4">分数: {score}</span>
        <button 
          onClick={() => setIsPaused(!isPaused)} 
          className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
        >
          {isPaused ? '继续' : '暂停'}
        </button>
        <button 
          onClick={resetGame} 
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          重新开始
        </button>
      </div>
      
      {gameOver && (
        <div className="mb-4 text-red-500 font-bold">游戏结束!</div>
      )}
      
      <div 
        ref={gameAreaRef}
        style={{ 
          width: GAME_WIDTH, 
          height: GAME_HEIGHT,
          position: 'relative',
          border: '1px solid #333',
          backgroundColor: '#000',
          overflow: 'hidden'
        }}
      >
        {/* 渲染玩家 */}
        <div 
          style={{
            position: 'absolute',
            left: player.x,
            top: player.y,
            width: player.width,
            height: player.height,
            backgroundColor: '#3498db',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
          }}
        />
        
        {/* 渲染子弹 */}
        {bullets.map((bullet, index) => (
          <div 
            key={`bullet-${index}`}
            style={{
              position: 'absolute',
              left: bullet.x,
              top: bullet.y,
              width: bullet.width,
              height: bullet.height,
              backgroundColor: bullet.isPlayerBullet ? '#f1c40f' : '#e74c3c',
              borderRadius: '2px'
            }}
          />
        ))}
        
        {/* 渲染敌人 */}
        {enemies.map((enemy, index) => (
          <div 
            key={`enemy-${index}`}
            style={{
              position: 'absolute',
              left: enemy.x,
              top: enemy.y,
              width: enemy.width,
              height: enemy.height,
              backgroundColor: '#e74c3c',
              clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)'
            }}
          />
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>使用方向键控制飞机移动</p>
        <p>空格键发射子弹</p>
        <p>P键暂停/继续游戏</p>
        <p>R键重新开始游戏</p>
      </div>
    </div>
  );
}