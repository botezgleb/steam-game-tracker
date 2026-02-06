import { useEffect, useMemo, useRef, useState } from "react";
import { getUser, getUserGames, updateUserGame } from "./api";
import type { GameStatus, UserGame } from "./api";
import videoBg from "../public/video-bg.mp4";
import mainBg from "../public/gradient-bg.mp4"
import { slides } from "./consts";
import "./App.css";

function getUserIdFromUrl(): number | null {
  const params = new URLSearchParams(window.location.search);
  const uid = params.get("userId");
  return uid ? Number(uid) : null;
}

function statusLabel(status: GameStatus) {
  if (status === "PLANNED") return "В планах";
  if (status === "PLAYING") return "В процессе";
  return "Пройдено";
}

function nextStatus(status: GameStatus): GameStatus {
  if (status === "PLANNED") return "PLAYING";
  if (status === "PLAYING") return "COMPLETED";
  return "PLANNED";
}

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} ч ${m} мин`;
}

export default function App() {
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [games, setGames] = useState<UserGame[]>([]);
  const [filter, setFilter] = useState<"ALL" | GameStatus>("ALL");
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const id = getUserIdFromUrl();
    if (id) setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    Promise.all([getUser(userId), getUserGames(userId)])
      .then(([userData, gamesData]) => {
        if (userData.ok) {
          setUserName(userData.user.steamName);
          setAvatarUrl(userData.user.avatarUrl ?? "");
        }
        if (gamesData.ok) setGames(gamesData.games);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!userId && videoRef.current) {
      videoRef.current.play().catch(e => {
        console.log("Автовоспроизведение заблокировано:", e);
      });
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 15000);
      return () => clearInterval(timer);
    }
  }, [userId]);

  const filteredGames = useMemo(() => {
    if (filter === "ALL") return games;
    return games.filter((g) => g.status === filter);
  }, [games, filter]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!userId) {
    return (
      <div className="login-page">
        <video 
          ref={videoRef}
          src={videoBg} 
          autoPlay 
          muted 
          loop 
          playsInline
          className="login-video"
        ></video>
        <div className="login-overlay"></div>
        <div className="login-container">
          <div className="login-left">
            <h1 className="title">HEAVEN</h1>
            <a
              className="btn primary login-btn"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.open("http://localhost:3001/api/steam/login", "_blank");
              }}
            >
              Войти через Steam
            </a>
          </div>
          
          <div className="login-right">
            <div className="carousel-container">
              <div className="carousel">
                <div 
                  className="slides-container"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                    transition: 'transform 0.5s ease-in-out'
                  }}
                >
                  {slides.map((slide) => (
                    <div key={slide.id} className="slide">
                      <div className="slide-image-container">
                        <img 
                          src={slide.image} 
                          alt={slide.title}
                          className="slide-image"
                        />
                        <div className="image-overlay"></div>
                      </div>
                      <div className="slide-content">
                        <h2 className="slide-title">{slide.title}</h2>
                        <p className="slide-description">{slide.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="carousel-btn prev" onClick={prevSlide}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <button className="carousel-btn next" onClick={nextSlide}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <div className="carousel-dots">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-bg-container">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="page-video-bg"
          src={mainBg}
        />
        <div className="page-bg-overlay"></div>
        <div className="page-bg-blur"></div>
      </div>
      
      <header className="header">
        <div className="user">
          <img className="avatar" src={avatarUrl || "/avatar-placeholder.png"} alt="avatar" />
          <div className="user-info">
            <div className="name">{userName}</div>
            <div className="subtitle">Моя библиотека Steam</div>
          </div>
        </div>
      </header>

      <div className="controls">
        <button className={"btn " + (filter === "ALL" ? "active" : "")} onClick={() => setFilter("ALL")}>Все</button>
        <button className={"btn " + (filter === "PLANNED" ? "active" : "")} onClick={() => setFilter("PLANNED")}>В планах</button>
        <button className={"btn " + (filter === "PLAYING" ? "active" : "")} onClick={() => setFilter("PLAYING")}>В процессе</button>
        <button className={"btn " + (filter === "COMPLETED" ? "active" : "")} onClick={() => setFilter("COMPLETED")}>Пройдено</button>
      </div>

      <div className="stats">
        <div>Игры: <b>{games.length}</b></div>
        <div>Время: <b>{formatTime(games.reduce((a, g) => a + g.playtimeMinutes, 0))}</b></div>
      </div>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <div className="games">
          {filteredGames.map((g) => (
            <div className="game" key={g.id}>
              <img
                className="game-img"
                src={g.game.headerImageUrl ?? g.game.iconUrl ?? "/game-placeholder.png"}
                alt={g.game.title}
              />

              <div className="game-info">
                <div className="game-title">{g.game.title}</div>
                <div className="game-meta">
                  <span className={"badge " + g.status.toLowerCase()}>{statusLabel(g.status)}</span>
                  <span>{formatTime(g.playtimeMinutes)}</span>
                </div>
              </div>

              <button
                className="btn small"
                onClick={async () => {
                  const next = nextStatus(g.status);
                  const res = await updateUserGame(userId, g.gameId, { status: next });
                  if (res.ok) {
                    setGames((prev) =>
                      prev.map((x) =>
                        x.id === g.id ? { ...x, status: next } : x
                      )
                    );
                  }
                }}
              >
                Изменить статус
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}