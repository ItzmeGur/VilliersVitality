document.addEventListener("DOMContentLoaded", () => { // Waits for the entire DOM to load before running the script
  const highlightsContent = document.getElementById("highlights-content"); // Gets the element where updates will be shown
  const quoteRotator = document.getElementById("quote-rotator"); // Gets the element where quotes will rotate

  const updates = [ // Array of recent announcements or updates
    "🎉 New Art Club workshop announced for next Friday!",
    "🏏 Cricket Club won the inter-school championship!",
    "🎭 Drama Club auditions start next Monday.",
    "🎵 Music Club preparing for the annual concert.",
    "📅 Upcoming event: Spring Term Fitness Challenge.",
    "🧘 Meditation sessions every Wednesday afternoon.",
    "🏀 Basketball Club training sessions open for all skill levels.",
    "📚 Academic clubs hosting study groups this weekend."
  ];

  const quotes = [ // Array of motivational quotes
    "“Extracurricular activities are the key to unlocking your full potential.”",
    "“Participation in clubs builds character and confidence.”",
    "“Discover your passion beyond the classroom.”",
    "“Teamwork makes the dream work.”",
    "“Leadership is learned through involvement.”",
    "“Every activity is a step towards success.”"
  ];

  let currentUpdateIndex = 0; // Tracks current update index
  let currentQuoteIndex = 0; // Tracks current quote index

  function showNextUpdate() { // Updates the content box with the next announcement
    highlightsContent.textContent = updates[currentUpdateIndex]; // Display current update
    currentUpdateIndex = (currentUpdateIndex + 1) % updates.length; // Loop back to start when at the end
  }

  function showNextQuote() { // Updates the quote rotator with the next quote
    quoteRotator.textContent = quotes[currentQuoteIndex]; // Display current quote
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length; // Loop back when last quote is reached
  }

  showNextUpdate(); // Show the first update on load
  showNextQuote(); // Show the first quote on load

  setInterval(showNextUpdate, 6000); // Update the announcements every 6 seconds
  setInterval(showNextQuote, 6000); // Rotate quotes every 6 seconds

  // Image Rotator
  let images = document.querySelectorAll(".slideshow-container img"); // Selects all images in the slideshow
  let index = 0; // Index to track current image

  function changeImage() { // Function to switch active image
    images.forEach(img => img.classList.remove("active")); // Remove 'active' from all images
    images[index].classList.add("active"); // Add 'active' to the current image
    index = (index + 1) % images.length; // Move to next image, loop at end
  }

  changeImage(); // Show the first image on load
  setInterval(changeImage, 6000); // Rotate images every 6 seconds
});
