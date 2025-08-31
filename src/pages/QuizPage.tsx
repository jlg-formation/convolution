import { useState } from "react";
import { Link } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

interface QuizResult {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question:
      "Quelle sera la taille de sortie d'une convolution avec une image 8×8, un kernel 3×3, stride=1 et padding=0 ?",
    options: ["8×8", "6×6", "7×7", "5×5"],
    correctAnswer: 1,
    explanation:
      "Formule: (8-3)/1 + 1 = 6. Sans padding, la sortie est toujours plus petite que l'entrée.",
    category: "Calcul de taille",
  },
  {
    id: 2,
    question: "Quel est l'avantage principal du padding 'same' ?",
    options: [
      "Accélère le calcul",
      "Préserve la taille de l'image de sortie",
      "Réduit le nombre de paramètres",
      "Améliore la précision",
    ],
    correctAnswer: 1,
    explanation:
      "Le padding 'same' ajoute des zéros pour que la sortie ait la même taille que l'entrée (pour stride=1).",
    category: "Padding",
  },
  {
    id: 3,
    question: "Que se passe-t-il quand on augmente le stride de 1 à 2 ?",
    options: [
      "La taille de sortie double",
      "La taille de sortie diminue de moitié environ",
      "Le nombre de paramètres augmente",
      "La convolution devient plus précise",
    ],
    correctAnswer: 1,
    explanation:
      "Un stride de 2 signifie qu'on saute un pixel sur deux, réduisant ainsi la taille de sortie d'environ la moitié.",
    category: "Stride",
  },
  {
    id: 4,
    question: "Quelle est la différence entre convolution et corrélation ?",
    options: [
      "Il n'y en a aucune",
      "La convolution retourne le kernel avant le calcul",
      "La corrélation est plus rapide",
      "La convolution utilise moins de mémoire",
    ],
    correctAnswer: 1,
    explanation:
      "En convolution mathématique pure, le kernel est retourné (flippé). En pratique, les frameworks font souvent de la corrélation.",
    category: "Théorie",
  },
  {
    id: 5,
    question:
      "Pourquoi utilise-t-on plusieurs filtres dans une couche de convolution ?",
    options: [
      "Pour réduire le temps de calcul",
      "Pour détecter différents types de caractéristiques",
      "Pour diminuer la taille de l'image",
      "Pour éviter le surapprentissage",
    ],
    correctAnswer: 1,
    explanation:
      "Chaque filtre spécialise dans la détection d'une caractéristique différente (contours, textures, etc.).",
    category: "Architecture",
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(quizQuestions.length).fill(-1),
  );
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  // Calculer le score
  const calculateScore = () => {
    const correct = results.filter((r) => r.isCorrect).length;
    return Math.round((correct / quizQuestions.length) * 100);
  };

  // Gérer la sélection d'une réponse
  const handleAnswerSelect = (answerIndex: number) => {
    if (quizCompleted) return;

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);

    // Animer la sélection
    setAnimationClass("animate-pulse");
    setTimeout(() => setAnimationClass(""), 300);

    // Afficher l'explication après sélection
    setShowExplanation(true);
  };

  // Passer à la question suivante
  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setShowExplanation(false);
      setAnimationClass("slide-in");
      setTimeout(() => setAnimationClass(""), 500);
    } else {
      // Terminer le quiz
      finishQuiz();
    }
  };

  // Terminer le quiz
  const finishQuiz = () => {
    const quizResults: QuizResult[] = quizQuestions.map((question, index) => ({
      questionId: question.id,
      selectedAnswer: selectedAnswers[index],
      isCorrect: selectedAnswers[index] === question.correctAnswer,
    }));

    setResults(quizResults);
    setQuizCompleted(true);
    setShowResults(true);

    // Sauvegarder le score dans localStorage
    const score = Math.round(
      (quizResults.filter((r) => r.isCorrect).length / quizQuestions.length) *
        100,
    );
    localStorage.setItem("convolution-quiz-score", score.toString());
    localStorage.setItem("convolution-quiz-date", new Date().toISOString());
  };

  // Recommencer le quiz
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quizQuestions.length).fill(-1));
    setShowResults(false);
    setQuizCompleted(false);
    setResults([]);
    setShowExplanation(false);
    setAnimationClass("");
  };

  // Obtenir la couleur selon le score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  // Obtenir le message selon le score
  const getScoreMessage = (score: number) => {
    if (score >= 90)
      return "🎉 Excellent ! Vous maîtrisez parfaitement les CNN !";
    if (score >= 80)
      return "👏 Très bien ! Vous avez une bonne compréhension des concepts.";
    if (score >= 60)
      return "👍 Pas mal ! Quelques révisions et ce sera parfait.";
    return "📚 Il faut revoir les bases. Consultez le cours et réessayez !";
  };

  const currentQ = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-8">
        <div className="mx-auto max-w-4xl px-4">
          {/* Résultats */}
          <div className="mb-8 text-center">
            <div className="mb-6 inline-block rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-6 py-2">
              <span className="font-medium text-blue-300">
                🏆 Résultats du Quiz
              </span>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-white">
              Quiz Terminé !
            </h1>
          </div>

          {/* Score principal */}
          <div className="mb-8 rounded-3xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-sm">
            <div className={`mb-4 text-8xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </div>
            <h2 className="mb-4 text-2xl text-white">
              {results.filter((r) => r.isCorrect).length} /{" "}
              {quizQuestions.length} réponses correctes
            </h2>
            <p className="text-xl text-white/80">{getScoreMessage(score)}</p>
          </div>

          {/* Détails des réponses */}
          <div className="mb-8 grid gap-4">
            {quizQuestions.map((question, index) => {
              const result = results[index];
              const isCorrect = result?.isCorrect;

              return (
                <div
                  key={question.id}
                  className={`rounded-xl border bg-white/5 p-6 backdrop-blur-sm ${
                    isCorrect
                      ? "border-green-500/30 bg-green-500/10"
                      : "border-red-500/30 bg-red-500/10"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${
                        isCorrect ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {isCorrect ? "✓" : "✗"}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 font-medium text-white">
                        {question.question}
                      </h3>
                      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`rounded-lg p-2 text-sm ${
                              optionIndex === question.correctAnswer
                                ? "border border-green-500/50 bg-green-500/30 text-green-200"
                                : optionIndex === result?.selectedAnswer &&
                                    !isCorrect
                                  ? "border border-red-500/50 bg-red-500/30 text-red-200"
                                  : "bg-white/5 text-white/70"
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-white/80 italic">
                        💡 {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={resetQuiz}
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              🔄 Recommencer le Quiz
            </button>
            <Link
              to="/learn"
              className="rounded-full border-2 border-white/30 px-8 py-4 text-center text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10"
            >
              📚 Revoir le Cours
            </Link>
            <Link
              to="/demo"
              className="rounded-full bg-gradient-to-r from-green-500 to-teal-600 px-8 py-4 text-center text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              🚀 Essayer la Démo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <div className="mb-6 inline-block rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-6 py-2">
            <span className="font-medium text-blue-300">
              🧠 Quiz Interactif
            </span>
          </div>
          <h1 className="mb-4 text-5xl font-bold text-white">
            Testez vos
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Connaissances
            </span>
          </h1>
          <p className="text-xl text-white/80">
            5 questions pour valider votre compréhension des CNN
          </p>
        </div>

        {/* Barre de progression */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-white/80">
              Question {currentQuestion + 1} sur {quizQuestions.length}
            </span>
            <span className="text-sm text-white/80">
              {Math.round(progress)}% complété
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-white/20">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question actuelle */}
        <div
          className={`mb-8 rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm ${animationClass}`}
        >
          <div className="mb-6">
            <div className="mb-4 inline-block rounded-full bg-blue-500/30 px-4 py-2">
              <span className="text-sm font-medium text-blue-200">
                {currentQ.category}
              </span>
            </div>
            <h2 className="text-2xl leading-relaxed font-bold text-white">
              {currentQ.question}
            </h2>
          </div>

          {/* Options de réponse */}
          <div className="mb-6 grid gap-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={quizCompleted}
                className={`rounded-xl border-2 p-4 text-left transition-all duration-300 ${
                  selectedAnswers[currentQuestion] === index
                    ? showExplanation && index === currentQ.correctAnswer
                      ? "border-green-500 bg-green-500/20 text-green-200"
                      : showExplanation && index !== currentQ.correctAnswer
                        ? "border-red-500 bg-red-500/20 text-red-200"
                        : "border-blue-500 bg-blue-500/20 text-blue-200"
                    : "border-white/30 bg-white/5 text-white hover:border-white/50 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold ${
                      selectedAnswers[currentQuestion] === index
                        ? showExplanation && index === currentQ.correctAnswer
                          ? "border-green-500 bg-green-500 text-white"
                          : showExplanation && index !== currentQ.correctAnswer
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-blue-500 bg-blue-500 text-white"
                        : "border-white/50"
                    }`}
                  >
                    {selectedAnswers[currentQuestion] === index &&
                    showExplanation
                      ? index === currentQ.correctAnswer
                        ? "✓"
                        : "✗"
                      : String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Explication */}
          {showExplanation && (
            <div
              className={`mb-6 rounded-xl border border-white/20 bg-white/5 p-6 transition-all duration-500 ${
                selectedAnswers[currentQuestion] === currentQ.correctAnswer
                  ? "border-green-500/30"
                  : "border-red-500/30"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="mb-2 font-semibold text-white">
                    Explication :
                  </h4>
                  <p className="text-white/90">{currentQ.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bouton suivant */}
          {selectedAnswers[currentQuestion] !== -1 && (
            <div className="text-center">
              <button
                onClick={nextQuestion}
                className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {currentQuestion === quizQuestions.length - 1
                  ? "🏁 Terminer le Quiz"
                  : "➡️ Question Suivante"}
              </button>
            </div>
          )}
        </div>

        {/* Aide */}
        <div className="text-center text-sm text-white/60">
          💡 Sélectionnez une réponse pour voir l'explication immédiate
        </div>
      </div>
    </div>
  );
}
