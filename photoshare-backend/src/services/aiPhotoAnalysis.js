// Simple keyword-based tagging (no external API needed)
const analyzePhotoContent = async (imageBuffer, originalName) => {
  try {
    const analysis = {
      tags: [],
      detectedObjects: [],
      sceneType: "unknown",
      peopleCount: 0,
      emotionAnalysis: {
        dominant: "happy",
        confidence: 0.8,
      },
    };

    // Analyze filename for context clues
    const fileName = originalName.toLowerCase();
    const fileAnalysis = analyzeFileName(fileName);

    // Add filename-based tags
    analysis.tags.push(...fileAnalysis.tags);

    // Simulate AI detection based on common patterns
    const simulatedDetection = simulateAIDetection(fileName);
    analysis.detectedObjects = simulatedDetection.objects;
    analysis.peopleCount = simulatedDetection.peopleCount;
    analysis.sceneType = simulatedDetection.sceneType;

    return analysis;
  } catch (error) {
    console.error("AI Analysis error:", error);
    return getDefaultAnalysis();
  }
};

const analyzeFileName = (fileName) => {
  const tags = [];

  // Ceremony-related keywords
  if (
    fileName.includes("ceremony") ||
    fileName.includes("wedding") ||
    fileName.includes("mandap") ||
    fileName.includes("vows") ||
    fileName.includes("phera") ||
    fileName.includes("saptapadi")
  ) {
    tags.push({
      category: "ceremony",
      confidence: 0.9,
      detectedObjects: ["wedding ceremony"],
    });
  }

  // Reception keywords
  if (
    fileName.includes("reception") ||
    fileName.includes("party") ||
    fileName.includes("dinner") ||
    fileName.includes("celebration")
  ) {
    tags.push({
      category: "reception",
      confidence: 0.8,
      detectedObjects: ["reception"],
    });
  }

  // Dance keywords
  if (
    fileName.includes("dance") ||
    fileName.includes("dancing") ||
    fileName.includes("sangam") ||
    fileName.includes("music")
  ) {
    tags.push({
      category: "dance",
      confidence: 0.9,
      detectedObjects: ["dancing"],
    });
  }

  // Family keywords
  if (
    fileName.includes("family") ||
    fileName.includes("group") ||
    fileName.includes("together") ||
    fileName.includes("relatives")
  ) {
    tags.push({
      category: "family",
      confidence: 0.8,
      detectedObjects: ["family group"],
    });
  }

  // Couple keywords
  if (
    fileName.includes("couple") ||
    fileName.includes("bride") ||
    fileName.includes("groom") ||
    fileName.includes("together")
  ) {
    tags.push({
      category: "couple",
      confidence: 0.85,
      detectedObjects: ["bride and groom"],
    });
  }

  // Mehendi keywords
  if (
    fileName.includes("mehendi") ||
    fileName.includes("henna") ||
    fileName.includes("mehndi")
  ) {
    tags.push({
      category: "mehendi",
      confidence: 0.95,
      detectedObjects: ["mehendi ceremony"],
    });
  }

  // Food keywords
  if (
    fileName.includes("food") ||
    fileName.includes("dinner") ||
    fileName.includes("lunch") ||
    fileName.includes("catering")
  ) {
    tags.push({ category: "food", confidence: 0.9, detectedObjects: ["food"] });
  }

  // Decoration keywords
  if (
    fileName.includes("decoration") ||
    fileName.includes("flowers") ||
    fileName.includes("decor") ||
    fileName.includes("venue")
  ) {
    tags.push({
      category: "decoration",
      confidence: 0.8,
      detectedObjects: ["decorations"],
    });
  }

  // Default to candid if no specific category found
  if (tags.length === 0) {
    tags.push({
      category: "candid",
      confidence: 0.6,
      detectedObjects: ["candid moment"],
    });
  }

  return { tags };
};

const simulateAIDetection = (fileName) => {
  // Simulate realistic AI detection results
  const scenarios = {
    ceremony: {
      objects: ["person", "wedding dress", "suit", "flowers", "decoration"],
      peopleCount: Math.floor(Math.random() * 20) + 5, // 5-25 people
      sceneType: "ceremony",
    },
    reception: {
      objects: ["person", "table", "food", "lights", "decoration"],
      peopleCount: Math.floor(Math.random() * 50) + 10, // 10-60 people
      sceneType: "indoor_event",
    },
    dance: {
      objects: ["person", "music", "stage", "lights"],
      peopleCount: Math.floor(Math.random() * 30) + 3, // 3-33 people
      sceneType: "celebration",
    },
    family: {
      objects: ["person", "formal wear", "smile"],
      peopleCount: Math.floor(Math.random() * 15) + 3, // 3-18 people
      sceneType: "portrait",
    },
    couple: {
      objects: ["person", "wedding dress", "suit", "smile", "flowers"],
      peopleCount: 2,
      sceneType: "portrait",
    },
  };

  // Determine scenario based on filename
  for (const [key, scenario] of Object.entries(scenarios)) {
    if (fileName.includes(key)) {
      return scenario;
    }
  }

  // Default scenario
  return {
    objects: ["person", "casual wear"],
    peopleCount: Math.floor(Math.random() * 5) + 1,
    sceneType: "candid",
  };
};

const getDefaultAnalysis = () => ({
  tags: [{ category: "candid", confidence: 0.5, detectedObjects: ["photo"] }],
  detectedObjects: ["photo"],
  sceneType: "unknown",
  peopleCount: 1,
  emotionAnalysis: { dominant: "happy", confidence: 0.7 },
});

module.exports = {
  analyzePhotoContent,
};
