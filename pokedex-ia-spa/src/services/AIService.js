//Importando librerías de tensorflow para los modelos pre-entrenados
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { IMAGENET_CLASSES } from "./imagenet-classes.js";

export class AIService {
  constructor() {
    this.model = null;
    this.labels = IMAGENET_CLASSES;
  }

  async init() {
    if (this.model) {
      console.log("Modelo de IA ya cargado.");
      return;
    }
    console.log("Cargando modelo de IA...");
    try {
      this.model = await mobilenet.load({ version: 2, alpha: 1.0 });
      console.log("Modelo de IA cargado con éxito.");
    } catch (error) {
      console.error(
        "Error cargando el modelo de IA. Usando predicción simulada.",
        error
      );
      this.model = {
        classify: async () => [
          { className: "mock classification", probability: 0.8 },
        ],
      };
    }
  }

  async classifyImage(imageElement) {
    if (!this.model) {
      throw new Error("El modelo de IA no ha sido inicializado.");
    }

    const predictions = await this.model.classify(imageElement);
    console.log("Predicciones:", predictions);
    return predictions;
  }
}
