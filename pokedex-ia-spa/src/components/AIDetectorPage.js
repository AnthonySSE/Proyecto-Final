import { AIService } from '../services/AIService.js';

export class AIDetectorPage {
    constructor() {
        this.aiService = new AIService();
        this.selectedImage = null;
    }

    render() {
        const page = document.createElement('div');
        page.className = 'ai-detector-page py-8 bg-gray-100 min-h-screen';
        page.innerHTML = `
            <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-8">
                    <h1 class="text-4xl font-bold text-gray-800 mb-4">Detector IA de Imágenes</h1>
                    <p class="text-xl text-gray-600">Sube una imagen y la IA la clasificará usando MobileNet</p>
                </div>
                
                <div class="bg-white rounded-lg shadow-md p-8">
                    <div class="mb-8">
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <input type="file" id="image-input" accept="image/*" class="hidden">
                            <div id="upload-area" class="cursor-pointer">
                                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p class="text-lg text-gray-600 mb-2">Haz clic para subir una imagen</p>
                                <p class="text-sm text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                            </div>
                            <img id="preview-image" class="hidden max-w-full h-64 object-contain mx-auto mt-4 rounded-lg">
                        </div>
                    </div>
                    
                    <div class="text-center mb-6">
                        <button id="classify-btn" disabled 
                                class="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                            Clasificar Imagen
                        </button>
                    </div>
                    
                    <!-- AI Loading State -->
                    <div id="ai-loading" class="hidden text-center py-8">
                        <div class="w-12 h-12 mx-auto mb-4">
                            <div class="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p class="text-gray-600">Procesando con IA...</p>
                    </div>
                    
                    <!-- Results -->
                    <div id="classification-results" class="hidden">
                        <h3 class="text-xl font-semibold mb-4 text-center">Resultados de la Clasificación</h3>
                        <div id="results-list" class="space-y-2">
                            <!-- Results will be inserted here -->
                        </div>
                    </div>
                </div>
            </section>
        `;

        return page;
    }

    onMount() {
        this.attachEventListeners();
        this.aiService.loadModel(); // Preload AI model
    }

    attachEventListeners() {
        const imageInput = document.getElementById('image-input');
        const uploadArea = document.getElementById('upload-area');
        const classifyBtn = document.getElementById('classify-btn');

        // Upload area click
        uploadArea.addEventListener('click', () => {
            imageInput.click();
        });

        // File input change
        imageInput.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // Classify button
        classifyBtn.addEventListener('click', () => {
            this.classifyImage();
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-purple-500', 'bg-purple-50');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('border-purple-500', 'bg-purple-50');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-purple-500', 'bg-purple-50');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                imageInput.files = files;
                this.handleImageUpload({ target: { files } });
            }
        });
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido.');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert('El archivo es demasiado grande. Máximo 10MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImage = document.getElementById('preview-image');
            const uploadArea = document.getElementById('upload-area');
            const classifyBtn = document.getElementById('classify-btn');
            const resultsDiv = document.getElementById('classification-results');

            previewImage.src = e.target.result;
            previewImage.classList.remove('hidden');
            uploadArea.style.display = 'none';
            
            classifyBtn.disabled = false;
            resultsDiv.classList.add('hidden');
            
            this.selectedImage = previewImage;
        };
        reader.readAsDataURL(file);
    }

    async classifyImage() {
        if (!this.selectedImage) return;

        const aiLoading = document.getElementById('ai-loading');
        const resultsDiv = document.getElementById('classification-results');
        const resultsList = document.getElementById('results-list');
        const classifyBtn = document.getElementById('classify-btn');

        try {
            aiLoading.classList.remove('hidden');
            resultsDiv.classList.add('hidden');
            classifyBtn.disabled = true;

            // Classify the image
            const predictions = await this.aiService.classifyImage(this.selectedImage);
            
            // Display results
            this.displayResults(predictions);

        } catch (error) {
            console.error('Error classifying image:', error);
            resultsList.innerHTML = '<div class="text-red-600 text-center">Error al clasificar la imagen. Inténtalo de nuevo.</div>';
        } finally {
            aiLoading.classList.add('hidden');
            resultsDiv.classList.remove('hidden');
            classifyBtn.disabled = false;
        }
    }

    displayResults(results) {
        const resultsList = document.getElementById('results-list');
        
        resultsList.innerHTML = results.slice(0, 5).map((result, index) => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                    <span class="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        ${index + 1}
                    </span>
                    <span class="font-medium">${result.className}</span>
                </div>
                <div class="flex items-center">
                    <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
                             style="width: ${result.probability * 100}%"></div>
                    </div>
                    <span class="text-sm text-gray-600">${(result.probability * 100).toFixed(1)}%</span>
                </div>
            </div>
        `).join('');
    }
};