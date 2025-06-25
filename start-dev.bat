@echo off
echo 🚀 Iniciando Control de Proyectos App...
echo.

echo 📦 Instalando dependencias del backend...
cd backend
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Error instalando dependencias del backend
    pause
    exit /b 1
)

echo 📦 Instalando dependencias del frontend...
cd ../frontend
call npm install  
if %ERRORLEVEL% neq 0 (
    echo ❌ Error instalando dependencias del frontend
    pause
    exit /b 1
)

cd ..

echo.
echo ✅ Dependencias instaladas correctamente
echo 🔥 Iniciando servidores de desarrollo...
echo.
echo 🖥️  Backend ejecutándose en: http://localhost:5000
echo 🌐 Frontend ejecutándose en: http://localhost:3000
echo.
echo ⚠️  Presiona Ctrl+C para detener ambos servidores
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
start "Frontend Server" cmd /k "cd frontend && npm start"

echo 🎉 ¡Aplicación iniciada exitosamente!
echo Revisa las ventanas del backend y frontend que se abrieron
pause 