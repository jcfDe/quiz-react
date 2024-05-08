
import React, { useState, useEffect } from "react";
import '../App.css'
import Popup from "./Popup";
import useSound from "use-sound"
import sndOk from "../audios/sndOk.mp3"
import sndNo from "../audios/sndNo.mp3"
import sndLoad from "../audios/sndLoad.mp3"
import Top10 from "./Top10";
import localQuestions from "../preguntas/localquestion.json"
import Bar from "./Bar";

export default function Question() {
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [score, setScore] = useState(0);
  const [counter, setCounter] = useState(30);
  const [gameState, setGameState] = useState("home")
  const [user, setUser] = useState("")
  const [storedScore, setStoredScore] = useState(false)
  const [popup, setPopup] = useState("")
  const [top10, setTop10] = useState("")


  const [playsndOk] = useSound(sndOk);
  const [playsndNo] = useSound(sndNo);
  const [playsndLoad] = useSound(sndLoad);



  function newGame() {
    fetch(`https://opentdb.com/api.php?amount=10&category=18&type=multiple`) // amount = 10, esto trae 10 preguntas de la API
      .then(res => res.json())
      .then(json => {
        localStorage.setItem("questions", JSON.stringify(json.results))
        var answers = json.results.map((e) => {
          let array = e.incorrect_answers;
          array.push(e.correct_answer)
          return array.sort(() => Math.random() - 0.5);
        })
        localStorage.setItem("answers", JSON.stringify(answers))
      })
    setCurrentQuestion(0);
    playsndLoad();
    setScore(0)
    setGameState("loading")
    setTimeout(() => {
      setCounter(30);
      setGameState("game");
      setStoredScore(false);
    }, 8000)
  }
  var answers
  var questions
  var correct_answer
  if (localStorage.questions) {
    answers = JSON.parse(localStorage.getItem("answers"))
    questions = JSON.parse(localStorage.getItem("questions")).map(e => e.question)
    correct_answer = JSON.parse(localStorage.getItem("questions")).map(e => e.correct_answer)
  }

  function bridgeGame() {
        localStorage.setItem("questions", JSON.stringify(localQuestions))
        var answers = localQuestions.map((e) => {
          let array = e.incorrect_answers;
          array.push(e.correct_answer)
          return array.sort(() => Math.random() - 0.5);
        })
        localStorage.setItem("answers", JSON.stringify(answers))
    setCurrentQuestion(0);
    playsndLoad();
    setScore(0)
    setGameState("loading")
    setTimeout(() => {
      setCounter(30);
      setGameState("game");
      setStoredScore(false);
    }, 8000)
  }
  if (localStorage.questions) {
    answers = JSON.parse(localStorage.getItem("answers"))
    questions = JSON.parse(localStorage.getItem("questions")).map(e => e.question)
    correct_answer = JSON.parse(localStorage.getItem("questions")).map(e => e.correct_answer)
  }




  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const check = (e) => {
    if (currentQuestion < 10) {
      if (answers[currentQuestion][e] === correct_answer[currentQuestion]) {
        setScore(score + 1)
        setPopup("ok")
        playsndOk();
      } else {
        setPopup("no")
        playsndNo();
      }
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
        setCounter(30)
        setPopup("")
      }, 2500)
    }
  }

  useEffect(() => {
    if (counter === 0) {
      setCounter(30)
      setCurrentQuestion(currentQuestion + 1)
    }
  })

  useEffect(() => {
    if (currentQuestion > 9) {
      setGameState("finished")

    }
  }, [currentQuestion])

  useEffect(() => {
    var stats = localStorage.storeScore
    if (stats) {
      stats = JSON.parse(stats)
      var ordered = stats.sort(function (a, b) { return b.score - a.score })
      var top10 = ordered.slice(0, 10);
    }
    setTop10(top10)
  }, [storedScore])

  function saveScore() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    var storeScore = localStorage.storeScore
    let newscore = {
      "user": user,
      "score": score,
      "date": today
    }
    if (!storeScore && user.length > 2) {
      localStorage.setItem("storeScore", JSON.stringify([newscore]))
      setStoredScore(true)
    } else if (storeScore && user.length > 2) {
      storeScore = JSON.parse(storeScore)
      storeScore.push(newscore);
      localStorage.setItem("storeScore", JSON.stringify(storeScore))
      setStoredScore(true)
    } else {
      alert("El nombre tiene que tener al menos 3 caracteres")
    }
  }


  return (
    <div className="game">
      {popup === "ok"
        ? <Popup value="ok" /> : null}
      {popup === "no"
        ? <Popup value="no" /> : null}
      {gameState === "loading"
        ? <Popup value="loading" /> : null}
      {gameState === "home"
        ? <div className="home">
          <h1>Hackers Quiz</h1>
          <h3>Questions computer science</h3>
          <button onClick={() => newGame()}>Click here to start</button>
          <button onClick={() => bridgeGame()}>TheBridge Edition</button>
        </div>
        : null}
      {gameState === "game" && currentQuestion < 10 && answers
        ? <div className="page">
          <div className="header">
            <h2>Hacker's Quiz</h2>
            <button onClick={() => setGameState("home")}>Finish Game</button>
          </div>
          <Bar count={counter} current={currentQuestion} score={score}/>
          <div className="card">
            <h2 dangerouslySetInnerHTML={{ __html: questions[currentQuestion] }} className="question"></h2>
            <div className="answers">
              <button className="A" onClick={() => check(0)} dangerouslySetInnerHTML={{ __html: answers[currentQuestion][0] }}></button>
              <button className="B" onClick={() => check(1)} dangerouslySetInnerHTML={{ __html: answers[currentQuestion][1] }}></button>
              <button className="C" onClick={() => check(2)} dangerouslySetInnerHTML={{ __html: answers[currentQuestion][2] }}></button>
              <button className="D" onClick={() => check(3)} dangerouslySetInnerHTML={{ __html: answers[currentQuestion][3] }}></button>
            </div>
          </div>
        </div>
        : null}
      {gameState === "finished"
        ? <div>
          <h1>Game Over</h1>
          <p>Your result: {score}/10</p>
          <button onClick={() => setGameState("home")}>Home page</button>
        </div>
        : null}
      {!storedScore && gameState === "finished"
        ? <div><p>Insert your name: </p>
          <input type="text" onKeyPress={(e) => {
            if (e.key === "Enter") {
              saveScore()
            }
          }} onChange={(e) => setUser(e.target.value)} />
          <button onClick={() => saveScore()}>Guardar</button></div>
        : null}
      {gameState === "finished"
        ? <div>
          <Top10 score={top10} />
        </div>
        : null}
    </div>
  )
}
