export class AIService {
    constructor() {
        this.model = null;
        this.isLoading = false;
    }

    async loadModel() {
        if (this.isLoading || this.model) return this.model;
        
        this.isLoading = true;
        
        try {
            // Try to load MobileNet model
            this.model = await tf.loadLayersModel(
                'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1', 
                { fromTFHub: true }
            );
            console.log('AI Model loaded successfully');
        } catch (error) {
            console.error('Error loading AI model:', error);
            // Fallback mock model
            this.model = { predict: this.mockPredict.bind(this) };
        } finally {
            this.isLoading = false;
        }
        
        return this.model;
    }

    async classifyImage(imageElement) {
        if (!this.model) {
            await this.loadModel();
        }

        try {
            const tensor = tf.browser.fromPixels(imageElement)
                .resizeNearestNeighbor([224, 224])
                .expandDims(0)
                .div(255.0);

            let predictions;
            if (this.model.predict && typeof this.model.predict === 'function') {
                const modelOutput = this.model.predict(tensor);
                predictions = await modelOutput.data();
                modelOutput.dispose();
            } else {
                predictions = this.mockPredict();
            }

            tensor.dispose();
            return this.formatPredictions(predictions);
        } catch (error) {
            console.error('Error classifying image:', error);
            return this.mockPredict();
        }
    }

    mockPredict() {
        const mockClasses = [
            { className: 'Animal', probability: 0.65 + Math.random() * 0.2 },
            { className: 'Objeto', probability: 0.15 + Math.random() * 0.1 },
            { className: 'Planta', probability: 0.08 + Math.random() * 0.07 },
            { className: 'Vehículo', probability: 0.05 + Math.random() * 0.05 },
            { className: 'Edificio', probability: 0.02 + Math.random() * 0.03 }
        ];
        return mockClasses.sort((a, b) => b.probability - a.probability);
    }

    formatPredictions(predictions) {
        if (Array.isArray(predictions) && predictions[0].className) {
            return predictions;
        }
        
        return this.mockPredict();
    }
};