
import * as tf from '@tensorflow/tfjs';

// This is a simple symptom-based model that uses a basic neural network
// In a real app, you would use a pre-trained model or train a more sophisticated one
export const createSymptomModel = async (simplified = false): Promise<tf.LayersModel> => {
  // Simple model for symptom analysis - in real app, you would load a pre-trained model
  const model = tf.sequential();
  
  // For simplified model, use smaller architecture
  const hiddenUnits = simplified ? 8 : 16;
  
  // Input layer - assuming we encode symptoms as binary features (1 = present, 0 = not present)
  model.add(tf.layers.dense({
    inputShape: [12], // Common symptoms count (fever, headache, cough, etc.)
    units: hiddenUnits, 
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: simplified ? 4 : 8,
    activation: 'relu'
  }));
  
  // Output layer - multiple conditions probability
  model.add(tf.layers.dense({
    units: 5, // Number of possible conditions to predict
    activation: 'sigmoid'
  }));
  
  // Compile the model
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });
  
  await initializeModelWeights(model);
  
  return model;
};

export const createHealthPredictionModel = async (simplified = false): Promise<tf.LayersModel> => {
  // Simple model for health metrics analysis
  const model = tf.sequential();
  
  // For simplified model, use smaller architecture
  const hiddenUnits = simplified ? 6 : 12;
  
  // Input layer for health metrics (age, bp, bmi, etc.)
  model.add(tf.layers.dense({
    inputShape: [7], // Number of health metrics
    units: hiddenUnits, 
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: simplified ? 4 : 8,
    activation: 'relu'
  }));
  
  // Output layer - risk probabilities for different conditions
  model.add(tf.layers.dense({
    units: 3, // Diabetes, hypertension, heart disease
    activation: 'sigmoid'
  }));
  
  // Compile the model
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });
  
  await initializeHealthModelWeights(model);
  
  return model;
};

// Initialize with some weights to simulate a pre-trained model
// In a real app, you would load weights from a real trained model
const initializeModelWeights = async (model: tf.LayersModel) => {
  // This simulates loading pre-trained weights
  // In a real app, you'd use model.loadWeights() with actual weights

  // Set some predetermined weights to make the model somewhat predictable
  const weights = model.getWeights().map(w => {
    const newW = tf.randomNormal(w.shape, 0, 0.1);
    return newW;
  });
  
  model.setWeights(weights);
};

const initializeHealthModelWeights = async (model: tf.LayersModel) => {
  // Similar to above but for health prediction model
  const weights = model.getWeights().map(w => {
    const newW = tf.randomNormal(w.shape, 0, 0.1);
    return newW;
  });
  
  model.setWeights(weights);
};

// Encode symptoms as binary features
export const encodeSymptoms = (selectedSymptoms: string[], allSymptoms: string[]): number[] => {
  return allSymptoms.map(symptom => selectedSymptoms.includes(symptom) ? 1 : 0);
};

// Predict conditions based on symptoms
export const predictConditions = async (
  model: tf.LayersModel, 
  encodedSymptoms: number[]
): Promise<Array<{condition: string, probability: number}>> => {
  const input = tf.tensor2d([encodedSymptoms]);
  const prediction = await model.predict(input) as tf.Tensor;
  const values = await prediction.data();
  
  input.dispose();
  prediction.dispose();
  
  // Map the prediction values to conditions
  const conditions = [
    "Common Cold",
    "Influenza",
    "Viral Infection",
    "Respiratory Infection",
    "Migraine"
  ];
  
  return conditions.map((condition, i) => ({
    condition,
    probability: values[i]
  })).sort((a, b) => b.probability - a.probability);
};

// Predict health risks
export const predictHealthRisks = async (
  model: tf.LayersModel,
  healthData: {
    age: number,
    systolic: number,
    diastolic: number,
    bloodSugar: number,
    weight: number,
    height: number,
    cholesterol: number
  }
): Promise<{
  diabetes: number,
  hypertension: number,
  heartDisease: number
}> => {
  // Normalize inputs
  const normalizedInputs = [
    healthData.age / 100,
    healthData.systolic / 200,
    healthData.diastolic / 120,
    healthData.bloodSugar / 200,
    healthData.weight / 150,
    healthData.height / 200,
    healthData.cholesterol / 300
  ];
  
  const input = tf.tensor2d([normalizedInputs]);
  const prediction = await model.predict(input) as tf.Tensor;
  const values = await prediction.data();
  
  input.dispose();
  prediction.dispose();
  
  return {
    diabetes: values[0],
    hypertension: values[1],
    heartDisease: values[2]
  };
};
