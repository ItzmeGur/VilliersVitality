document.addEventListener("DOMContentLoaded", () => {
  const highlightsContent = document.getElementById("highlights-content");
  const quoteRotator = document.getElementById("quote-rotator");

  const updates = [
    "🎉 New Art Club workshop announced for next Friday!",
    "🏏 Cricket Club won the inter-school championship!",
    "🎭 Drama Club auditions start next Monday.",
    "🎵 Music Club preparing for the annual concert.",
    "📅 Upcoming event: Spring Term Fitness Challenge.",
    "🧘 Meditation sessions every Wednesday afternoon.",
    "🏀 Basketball Club training sessions open for all skill levels.",
    "📚 Academic clubs hosting study groups this weekend."
  ];

  const quotes = [
    "“Extracurricular activities are the key to unlocking your full potential.”",
    "“Participation in clubs builds character and confidence.”",
    "“Discover your passion beyond the classroom.”",
    "“Teamwork makes the dream work.”",
    "“Leadership is learned through involvement.”",
    "“Every activity is a step towards success.”"
  ];

  let currentUpdateIndex = 0;
  let currentQuoteIndex = 0;

  function showNextUpdate() {
    highlightsContent.textContent = updates[currentUpdateIndex];
    currentUpdateIndex = (currentUpdateIndex + 1) % updates.length;
  }

  function showNextQuote() {
    quoteRotator.textContent = quotes[currentQuoteIndex];
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
  }

  showNextUpdate();
  showNextQuote();

  setInterval(showNextUpdate, 6000);
  setInterval(showNextQuote, 6000);

  // Image Rotator
  let images = document.querySelectorAll(".slideshow-container img");
  let index = 0;

  function changeImage() {
    images.forEach(img => img.classList.remove("active"));
    images[index].classList.add("active");
    index = (index + 1) % images.length;
  }

  changeImage();
  setInterval(changeImage, 6000);
});
