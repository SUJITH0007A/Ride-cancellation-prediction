@echo off
cd /d "%~dp0..\ml-service"
echo Installing Python dependencies...
python -m pip install -r requirements.txt
echo.
echo Generating dataset...
python generate_dataset.py
echo.
echo Training model...
python train_model.py
echo.
echo Done. Run start-api.bat to launch the API.
pause
