import React, { useState, useEffect } from 'react';

const Home = () => {
  const [numQuestions, setNumQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (numQuestions > 0) {
      fetch(`https://opentdb.com/api.php?amount=${numQuestions}&category=9&difficulty=medium&type=multiple`)
        .then((res) => res.json())
        .then((data) => {
          const formattedQuestions = data.results.map((question) => ({
            question: question.question,
            options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
            correctAnswer: question.correct_answer,
          }));
          setQuestions(formattedQuestions);
        });
    }
  }, [numQuestions]);

  const handleOptionSelect = (selectedOption) => {
    if (!userAnswers[currentQuestion]) {
      if (selectedOption === questions[currentQuestion].correctAnswer) {
        setScore((prevScore) => prevScore + 1);
      }

      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentQuestion] = selectedOption;
      setUserAnswers(updatedAnswers);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < numQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setTimer(60);
    } else {
      setQuizCompleted(true);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      handleNextQuestion();
    }
  }, [timer]);

  const resetQuiz = () => {
    setScore(0);
    setUserAnswers([]);
    setCurrentQuestion(0);
    setQuizCompleted(false);
    setNumQuestions(0);
    setTimer(60);
  };

  return (
    <div className="quiz-app-container flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-300 to-purple-400 p-5">
      {/* Header section */}
      <header className="header w-full text-center flex flex-col items-center mb-6">
  <div className="flex items-center space-x-4 mb-16"> 
    <img
      src="https://yt3.googleusercontent.com/HLXws3xWxwE7mVHdh2XLErD7aK3dOhNzlSIc6VnSvIZOus8mwMf-UGyoypPjB2jx0g2A5Bm5G74=s900-c-k-c0x00ffffff-no-rj"
      alt="Logo"
      className="h-10"
    />
    <h1 className="text-4xl font-bold text-white">Upraised Quiz</h1>
  </div>
</header>


      {/* Quiz section */}
      {!quizCompleted ? (
        <>
          {numQuestions === 0 ? (
            <div className="setup-quiz text-center bg-white p-8 shadow-lg rounded-lg w-full max-w-lg mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-5">Quiz Setup</h1>
              <input
                type="number"
                className="border rounded-lg p-2 w-full text-center mb-4 text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter number of questions"
                onChange={(e) => setNumQuestions(parseInt(e.target.value) || 0)}
              />
              <p className="text-gray-600">Choose how many questions you'd like to answer!</p>
            </div>
          ) : (
            <>
              {questions.length > 0 && (
                <div className="quiz-card bg-white p-6 shadow-xl rounded-lg max-w-md mx-auto text-center transform transition duration-500 hover:scale-105 w-full">
                  <div className="progress-bar bg-gray-300 h-2 rounded-lg overflow-hidden mb-4">
                    <div
                      className="bg-purple-500 h-full transition-all"
                      style={{ width: `${((currentQuestion + 1) / numQuestions) * 100}%` }}
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-4 text-purple-700">{questions[currentQuestion].question}</h2>
                  <p className="text-lg font-medium text-red-500 mb-4">Time left: {timer}s</p>
                  <div className="options-list mt-4 space-y-3">
                    {questions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        className={`option-btn p-3 w-full border rounded-lg text-left font-semibold shadow-sm transition-all
                                    ${userAnswers[currentQuestion] === option ? 'bg-purple-300' : 'hover:bg-purple-100'}
                                  `}
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <button
                    className="next-btn mt-6 p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-lg w-full font-semibold"
                    onClick={handleNextQuestion}
                  >
                    {currentQuestion + 1 === numQuestions ? 'Submit' : 'Next Question'}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="quiz-result text-center bg-white p-8 shadow-lg rounded-lg max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Result</h1>
          <div className="flex justify-center items-center mb-6">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="circular-chart blue">
                <path
                  className="circle-bg"
                  d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  className="circle"
                  strokeDasharray={`${(score / numQuestions) * 100}, 100`}
                  d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#00acc1"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex justify-center items-center">
                <span className="text-2xl font-bold text-gray-800">{Math.round((score / numQuestions) * 100)}%</span>
              </div>
            </div>
          </div>
          <p className="text-lg text-gray-600">Correct: {score}</p>
          <p className="text-lg text-gray-600">Incorrect: {numQuestions - score}</p>
          <button
            className="reset-btn mt-6 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-md"
            onClick={resetQuiz}
          >
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
