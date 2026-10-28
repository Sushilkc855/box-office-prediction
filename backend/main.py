import math
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, field_validator

WEEKEND_MULTIPLIER = 8
FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

app = FastAPI(title="Box Office Estimator API")

class WeekendBoxOfficeRequest(BaseModel):
    movie_title: str = Field(min_length=1, max_length=200)
    preview_gross: float = Field(gt=0, allow_inf_nan=False)

    @field_validator("movie_title", mode="before")
    @classmethod
    def trim_movie_title(cls, value):
        return value.strip() if isinstance(value, str) else value


class WeekendBoxOfficeResponse(BaseModel):
    movie_title: str
    preview_gross: float
    estimated_weekend_box_office: int


@app.post("/api/predict", response_model=WeekendBoxOfficeResponse)
async def estimate_weekend_box_office(
    request: WeekendBoxOfficeRequest,
) -> WeekendBoxOfficeResponse:
    estimated_gross = request.preview_gross * WEEKEND_MULTIPLIER
    if not math.isfinite(estimated_gross):
        raise HTTPException(
            status_code=422,
            detail="The estimate is too large. Enter a smaller preview amount.",
        )

    return WeekendBoxOfficeResponse(
        movie_title=request.movie_title,
        preview_gross=request.preview_gross,
        estimated_weekend_box_office=round(estimated_gross),
    )


app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
