export const crops = {
  maize: {
    name: 'Maize (Corn)',
    plantingSeason: 'March-May, October-November',
    optimalTemp: { min: 18, max: 27 },
    optimalHumidity: { min: 40, max: 70 },
    waterNeed: 'Moderate to High',
    harvestTime: '120-150 days',
    icon: '🌽',
    riskFactors: ['Armyworms', 'Leaf blight', 'Rust']
  },
  beans: {
    name: 'Beans',
    plantingSeason: 'March-April, October-November',
    optimalTemp: { min: 15, max: 25 },
    optimalHumidity: { min: 35, max: 65 },
    waterNeed: 'Moderate',
    harvestTime: '80-100 days',
    icon: '',
    riskFactors: ['Bean flies', 'Rust', 'Anthracnose']
  },
  tea: {
    name: 'Tea',
    plantingSeason: 'Year-round',
    optimalTemp: { min: 12, max: 28 },
    optimalHumidity: { min: 55, max: 85 },
    waterNeed: 'High',
    harvestTime: '3 years to first harvest',
    icon: '🍵',
    riskFactors: ['Leaf blister', 'Brown blight', 'Scale insects']
  },
  coffee: {
    name: 'Coffee',
    plantingSeason: 'March-May, October-November',
    optimalTemp: { min: 15, max: 24 },
    optimalHumidity: { min: 50, max: 80 },
    waterNeed: 'High',
    harvestTime: '3-5 years to first harvest',
    icon: '☕',
    riskFactors: ['Coffee berry disease', 'Root rot', 'Leaf rust']
  },
  wheat: {
    name: 'Wheat',
    plantingSeason: 'March-May, September-November',
    optimalTemp: { min: 10, max: 20 },
    optimalHumidity: { min: 30, max: 60 },
    waterNeed: 'Low to Moderate',
    harvestTime: '120-140 days',
    icon: '🌾',
    riskFactors: ['Stem rust', 'Leaf rust', 'Fusarium']
  },
  tomatoes: {
    name: 'Tomatoes',
    plantingSeason: 'January-March, September-October',
    optimalTemp: { min: 20, max: 28 },
    optimalHumidity: { min: 50, max: 70 },
    waterNeed: 'Moderate',
    harvestTime: '60-80 days',
    icon: '🍅',
    riskFactors: ['Blight', 'Whiteflies', 'Fusarium wilt']
  },
  potatoes: {
    name: 'Potatoes',
    plantingSeason: 'March-May, September-November',
    optimalTemp: { min: 15, max: 22 },
    optimalHumidity: { min: 45, max: 70 },
    waterNeed: 'Moderate to High',
    harvestTime: '70-100 days',
    icon: '🥔',
    riskFactors: ['Late blight', 'Early blight', 'Bacterial wilt']
  },
  cabbage: {
    name: 'Cabbage',
    plantingSeason: 'June-September, December-January',
    optimalTemp: { min: 10, max: 20 },
    optimalHumidity: { min: 40, max: 70 },
    waterNeed: 'Moderate',
    harvestTime: '90-150 days',
    icon: '🥬',
    riskFactors: ['Leaf spot', 'Bacterial leaf blight', 'Diamondback moth']
  }
};

export const pestRiskThresholds = {
  high: {
    tempRange: { min: 22, max: 28 },
    humidityMin: 70,
    description: 'High pest activity expected'
  },
  moderate: {
    tempRange: { min: 18, max: 30 },
    humidityMin: 60,
    description: 'Moderate pest activity possible'
  },
  low: {
    description: 'Low pest pressure expected'
  }
};

export const getSoilMoistureAdvice = (humidity, rainfall, temp) => {
  if (humidity > 75 && rainfall > 10) {
    return {
      level: 'Very Wet',
      color: '#2563eb',
      advice: 'Ensure proper drainage to prevent waterlogging and root rot.'
    };
  } else if (humidity > 60 || rainfall > 5) {
    return {
      level: 'Moist (Ideal)',
      color: '#10b981',
      advice: 'Soil moisture is optimal. Monitor for overwatering.'
    };
  } else if (humidity > 40) {
    return {
      level: 'Dry',
      color: '#f59e0b',
      advice: 'Irrigation recommended. Plants may experience water stress.'
    };
  } else {
    return {
      level: 'Very Dry',
      color: '#ef4444',
      advice: 'Immediate irrigation needed. High risk of crop wilting.'
    };
  }
};

export const evaluateCropSuitability = (crop, weatherData) => {
  const { temperature, humidity, precipitation } = weatherData;
  const tempMatch = temperature >= crop.optimalTemp.min && temperature <= crop.optimalTemp.max;
  const humidityMatch = humidity >= crop.optimalHumidity.min && humidity <= crop.optimalHumidity.max;

  let suitability = 0;
  if (tempMatch) suitability += 40;
  if (humidityMatch) suitability += 40;
  if (precipitation > 0) suitability += 20;

  return {
    suitability: Math.min(100, suitability),
    tempStatus: tempMatch ? 'Optimal' : temperature > crop.optimalTemp.max ? 'Too Hot' : 'Too Cold',
    humidityStatus: humidityMatch ? 'Optimal' : humidity > crop.optimalHumidity.max ? 'Too Humid' : 'Too Dry'
  };
};
