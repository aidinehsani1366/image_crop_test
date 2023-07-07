let cropper;
let downloadButton; // Keep track of the download button

function initializeCropper() {
  const uploadedImage = document.getElementById('uploadedImage');
  const croppedCanvas = document.getElementById('croppedCanvas');
  const imageContainer = document.getElementById('imageContainer');

  if (downloadButton) {
    downloadButton.remove(); // Remove the previous download button
    downloadButton = null; // Reset the download button reference
  }

  cropper = new Cropper(uploadedImage, {
    viewMode: 1,
    aspectRatio: 1, // Set your desired aspect ratio here
    autoCropArea: 1,
    ready() {
      const initialCropBox = cropper.getCropBoxData();
      // Set a minimum crop size if desired
      initialCropBox.width = Math.max(200, initialCropBox.width);
      initialCropBox.height = Math.max(200, initialCropBox.height);
      cropper.setCropBoxData(initialCropBox);
    },
    crop() {
      const imageData = cropper.getCroppedCanvas().toDataURL();
      croppedCanvas.setAttribute('src', imageData);
      fileName = 'cropped-image.png'; // Set the desired file name and extension

      if (!downloadButton) {
        downloadButton = document.createElement('button');
        downloadButton.id = 'downloadButton';
        downloadButton.textContent = 'Download';

        downloadButton.addEventListener('click', () => {
          const link = document.createElement('a');
          link.href = cropper.getCroppedCanvas().toDataURL(); // Use the cropped canvas directly
          link.download = fileName;
          link.click();
        });

        imageContainer.appendChild(downloadButton);
      }
    },
  });
}

function destroyCropper() {
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }

  if (downloadButton) {
    downloadButton.remove();
    downloadButton = null;
  }
}

window.addEventListener('DOMContentLoaded', (event) => {
  const uploadInput = document.getElementById('uploadInput');
  const cropButton = document.getElementById('cropButton');

  uploadInput.addEventListener('change', (event) => {
    destroyCropper();

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const uploadedImage = document.getElementById('uploadedImage');
      uploadedImage.src = e.target.result;
      cropButton.disabled = false;
    };

    reader.readAsDataURL(file);
  });

  cropButton.addEventListener('click', (event) => {
    initializeCropper();
    cropButton.disabled = true;
  });
});
