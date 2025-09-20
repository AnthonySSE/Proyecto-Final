import { AIService } from "../services/AIService.js";

export class AIDetectorPage {
  constructor() {
    this.aiService = new AIService();
    this.selectedImage = null;
  }

  render() {
    const page = document.createElement("div");
    page.className = "page py-8 bg-gray-100 min-h-screen";
    page.innerHTML = `
      <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">Detector IA de Imágenes</h1>
          <p class="text-xl text-gray-600">Sube una imagen y la IA la clasificará usando MobileNet v2</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-8">
          <div class="mb-8">
            <div id="upload-container" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
              <input type="file" id="image-input" accept="image/*" class="hidden">
              <div id="upload-area" class="cursor-pointer">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="text-lg text-gray-600 mb-2">Haz clic para subir una imagen</p>
                <p class="text-sm text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                <p class="text-xs text-gray-400 mt-2">También puedes arrastrar y soltar</p>
              </div>
              <div id="preview-container" class="hidden">
                <img id="preview-image" class="max-w-full h-64 object-contain mx-auto rounded-lg shadow-md">
                <div class="mt-4 text-sm text-gray-600">
                  <p id="image-info"></p>
                  <button id="change-image-btn" class="text-purple-600 hover:text-purple-800 underline mt-2">
                    Cambiar imagen
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mb-6">
            <button id="classify-btn" disabled 
              class="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
              Clasificar Imagen
            </button>
          </div>

          <div id="ai-loading" class="hidden text-center py-8">
            <div class="w-12 h-12 mx-auto mb-4">
              <div class="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p class="text-gray-600">Procesando con IA...</p>
            <p class="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
          </div>

          <div id="model-loading-status" class="hidden text-center py-4">
              <p id="loading-text" class="text-sm text-gray-600">Cargando modelo de IA...</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div id="loading-bar" class="bg-purple-600 h-2 rounded-full transition-all duration-300" style="width: 0%;"></div>
              </div>
          </div>
          
          <div id="classification-results" class="hidden">
            <h3 class="text-xl font-semibold mb-4 text-center">Resultados de la Clasificación</h3>
            <div class="mb-4 text-center">
              <span class="text-sm text-gray-500">Confianza de la IA:</span>
            </div>
            <div id="results-list" class="space-y-3">
            </div>
            <div class="mt-6 text-center">
              <button id="classify-again-btn" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Clasificar otra imagen
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
    return page;
  }

  onMount() {
    this.attachInitialEventListeners();
    this.initModel();
  }

  attachInitialEventListeners() {
    //Obtener la referencia de los botones.
    const imageInput = document.getElementById("image-input");
    const uploadArea = document.getElementById("upload-area");
    const uploadContainer = document.getElementById("upload-container");
    const changeImageBtn = document.getElementById("change-image-btn");
    const classifyAgainBtn = document.getElementById("classify-again-btn");
    const classifyBtn = document.getElementById("classify-btn"); 

    uploadArea.addEventListener("click", () => imageInput.click());

    if (changeImageBtn) {
      changeImageBtn.addEventListener("click", () => imageInput.click());
    }

    if (classifyAgainBtn) {
      classifyAgainBtn.addEventListener("click", () => this.resetUploadArea());
    }

    if (classifyBtn) {
      classifyBtn.addEventListener("click", () => this.classifyImage());
    }

    imageInput.addEventListener("change", (e) => this.handleImageUpload(e));

    // Funcionalidad de Arrastrar y Soltar
    uploadContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadContainer.classList.add("border-purple-500", "bg-purple-50");
    });

    uploadContainer.addEventListener("dragleave", (e) => {
      e.preventDefault();
      uploadContainer.classList.remove("border-purple-500", "bg-purple-50");
    });

    uploadContainer.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadContainer.classList.remove("border-purple-500", "bg-purple-50");

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(files[0]);
        imageInput.files = dataTransfer.files;

        this.handleImageUpload({ target: { files } });
      }
    });
  }
//Inicialización del modelo
  async initModel() {
    const modelStatus = document.getElementById("model-loading-status");
    const loadingBar = document.getElementById("loading-bar");
    const loadingText = document.getElementById("loading-text");
    const classifyBtn = document.getElementById("classify-btn");

    modelStatus.classList.remove("hidden");
    loadingBar.style.width = '20%';
    
    try {
        await this.aiService.init();
        loadingBar.style.width = '100%';
        loadingText.textContent = 'Modelo listo para usar';
        classifyBtn.disabled = false;
    } catch (error) {
      console.error('Error inicializando el modelo:', error);
      loadingBar.style.width = '100%';
      loadingBar.classList.remove('bg-purple-600');
      loadingBar.classList.add('bg-red-600');
      loadingText.textContent = 'Error al cargar el modelo. Usando predicción simulada.';
      classifyBtn.disabled = false; // Habilitar para usar el mock
    }
  }

  handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("El archivo es demasiado grande. Máximo 10MB.");
      return;
    }
//Lectura de la imagen
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImage = document.getElementById("preview-image");
      const uploadArea = document.getElementById("upload-area");
      const previewContainer = document.getElementById("preview-container");
      const classifyBtn = document.getElementById("classify-btn");
      const resultsDiv = document.getElementById("classification-results");
      const imageInfo = document.getElementById("image-info");

      previewImage.src = e.target.result;
      uploadArea.classList.add("hidden");
      previewContainer.classList.remove("hidden");

      const fileSizeKB = (file.size / 1024).toFixed(1);
      imageInfo.textContent = `${file.name} (${fileSizeKB} KB)`;

      classifyBtn.disabled = false;
      resultsDiv.classList.add("hidden");

      this.selectedImage = previewImage;
    };
    reader.readAsDataURL(file);
  }

  //Función de clasificación de la imagen
  async classifyImage() {
    if (!this.selectedImage) return;

    const aiLoading = document.getElementById("ai-loading");
    const resultsDiv = document.getElementById("classification-results");
    const classifyBtn = document.getElementById("classify-btn");

    try {
      aiLoading.classList.remove("hidden");
      resultsDiv.classList.add("hidden");
      classifyBtn.disabled = true;

      const predictions = await this.aiService.classifyImage(
        this.selectedImage
      );

      this.displayResults(predictions);
    } catch (error) {
      console.error("Error classifying image:", error);
      const resultsList = document.getElementById("results-list");
      resultsList.innerHTML =
        '<div class="text-red-600 text-center">Error al clasificar la imagen. Inténtalo de nuevo.</div>';
    } finally {
      aiLoading.classList.add("hidden");
      resultsDiv.classList.remove("hidden");
      classifyBtn.disabled = false;
    }
  }

  // Función para mostrar los resultados
  displayResults(results) {
    const resultsList = document.getElementById("results-list");

    resultsList.innerHTML = results
      .map((result, index) => {
        const confidence = result.probability * 100;
        const confidenceColor =
          confidence > 50
            ? "text-green-600"
            : confidence > 25
            ? "text-yellow-600"
            : "text-red-600";

        return `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
              <div class="flex items-center">
                <span class="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  ${index + 1}
                </span>
                <div>
                  <span class="font-medium text-lg capitalize">${
                    result.className
                  }</span>
                  <div class="text-sm ${confidenceColor} font-semibold">
                    ${confidence.toFixed(1)}% de confianza
                  </div>
                </div>
              </div>
              <div class="flex items-center ml-4">
                <div class="w-32 bg-gray-200 rounded-full h-3 mr-3">
                  <div class="h-3 rounded-full transition-all duration-500 ${
                    confidence > 50
                      ? "bg-gradient-to-r from-green-400 to-green-600"
                      : confidence > 25
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                      : "bg-gradient-to-r from-red-400 to-red-600"
                  }" style="width: ${Math.max(
          confidence,
          5
        )}%"></div>
                </div>
                <span class="text-sm text-gray-600 min-w-[3rem]">${confidence.toFixed(
          1
        )}%</span>
              </div>
            </div>
        `;
      })
      .join("");
  }

  // Función para reiniciar el area de cargar
  resetUploadArea() {
    const uploadArea = document.getElementById("upload-area");
    const previewContainer = document.getElementById("preview-container");
    const classifyBtn = document.getElementById("classify-btn");
    const resultsDiv = document.getElementById("classification-results");
    const imageInput = document.getElementById("image-input");

    uploadArea.classList.remove("hidden");
    previewContainer.classList.add("hidden");
    classifyBtn.disabled = true;
    resultsDiv.classList.add("hidden");
    imageInput.value = "";
    this.selectedImage = null;
  }
}
