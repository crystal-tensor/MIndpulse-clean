import React, { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = "RIGHT";

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 生成随机食物位置
  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
  }, []);

  // 处理键盘输入
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case " ":
          setIsPaused(!isPaused);
          break;
        case "r":
          resetGame();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isPaused]);

  // 游戏主循环
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      const head = { ...snake[0] };

      // 移动蛇头
      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      // 检查碰撞
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE ||
        snake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return;
      }

      // 创建新蛇
      const newSnake = [head, ...snake];

      // 检查是否吃到食物
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore(score + 10);
      } else {
        newSnake.pop(); // 如果没吃到食物，移除尾部
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [snake, direction, food, gameOver, isPaused, score, generateFood]);

  // 重置游戏
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">贪吃蛇</h1>
      <div className="mb-4">
        <span className="mr-4">分数: {score}</span>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
        >
          {isPaused ? "继续" : "暂停"}
        </button>
        <button
          onClick={resetGame}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          重新开始
        </button>
      </div>

      {gameOver && <div className="mb-4 text-red-500 font-bold">游戏结束!</div>}

      <div
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          position: "relative",
          border: "1px solid #333",
          backgroundColor: "#f0f0f0",
        }}
      >
        {/* 渲染蛇 */}
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: index === 0 ? "#2a9d8f" : "#3a86ff",
              border: "1px solid #333",
            }}
          />
        ))}

        {/* 渲染食物 */}
        <div
          style={{
            position: "absolute",
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            backgroundColor: "#e63946",
            borderRadius: "50%",
          }}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>使用方向键控制蛇的移动</p>
        <p>空格键暂停/继续游戏</p>
        <p>R键重新开始游戏</p>
      </div>
    </div>
  );
}
