const weekendBoxOfficeForm = document.getElementById("weekendBoxOfficeForm");
const movieTitleInput = document.getElementById("movieTitleInput");
const previewGrossInput = document.getElementById("previewGrossInput");
const calculateWeekendBoxOfficeButton = document.getElementById("calculateWeekendBoxOfficeButton");
const estimateErrorMessage = document.getElementById("estimateErrorMessage");
const weekendBoxOfficeResult = document.getElementById("weekendBoxOfficeResult");
const resultMovieTitle = document.getElementById("resultMovieTitle");
const estimatedWeekendBoxOffice = document.getElementById("estimatedWeekendBoxOffice");

weekendBoxOfficeForm.addEventListener("input", clearWeekendBoxOfficeFeedback);
weekendBoxOfficeForm.addEventListener("submit", handleWeekendBoxOfficeSubmit);

function clearWeekendBoxOfficeFeedback() {
  weekendBoxOfficeResult.hidden = true;
  estimateErrorMessage.hidden = true;
}

async function handleWeekendBoxOfficeSubmit(event) {
  event.preventDefault();
  const movieTitle = movieTitleInput.value.trim();
  const previewGross = Number(previewGrossInput.value);

  clearWeekendBoxOfficeFeedback();

  if (!movieTitle || !Number.isFinite(previewGross) || previewGross <= 0) {
    estimateErrorMessage.textContent = "Enter a movie title and a positive preview amount.";
    estimateErrorMessage.hidden = false;
    return;
  }

  calculateWeekendBoxOfficeButton.textContent = "Calculating...";
  calculateWeekendBoxOfficeButton.disabled = true;
  movieTitleInput.disabled = true;
  previewGrossInput.disabled = true;

  try {
    const estimateResponse = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie_title: movieTitle, preview_gross: previewGross })
    });
    const estimateResponseBody = await estimateResponse.json();
    if (!estimateResponse.ok) {
      const { detail } = estimateResponseBody;
      const validationMessage = Array.isArray(detail) ? detail[0]?.msg : undefined;
      let apiErrorMessage = "Check the movie title and preview amount and try again.";
      if (typeof detail === "string") {
        apiErrorMessage = detail;
      } else if (typeof validationMessage === "string") {
        apiErrorMessage = validationMessage.replace(/^Value error, /, "");
      }
      throw new Error(apiErrorMessage);
    }

    resultMovieTitle.textContent = estimateResponseBody.movie_title;
    estimatedWeekendBoxOffice.textContent = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(estimateResponseBody.estimated_weekend_box_office);
    weekendBoxOfficeResult.hidden = false;
  } catch (error) {
    estimateErrorMessage.textContent = error.message || "Unable to calculate the estimate. Try again.";
    estimateErrorMessage.hidden = false;
  } finally {
    calculateWeekendBoxOfficeButton.textContent = "Calculate Weekend Box Office";
    calculateWeekendBoxOfficeButton.disabled = false;
    movieTitleInput.disabled = false;
    previewGrossInput.disabled = false;
  }
}
