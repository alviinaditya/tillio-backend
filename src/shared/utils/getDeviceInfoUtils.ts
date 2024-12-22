import os from "os";

export const getDeviceInfo = (userAgent?: string): string | undefined => {
  if (!userAgent) return undefined;
  let browserName = "Unknown Browser";
  let osName = "Unknown OS";

  // Regex patterns to match different browsers, Postman, and curl
  const browserPatterns = [
    { name: "Chrome", regex: /Chrome\/([0-9.]+)/ },
    { name: "Firefox", regex: /Firefox\/([0-9.]+)/ },
    { name: "Safari", regex: /Safari\/([0-9.]+)/ },
    { name: "Edge", regex: /Edge\/([0-9.]+)/ },
    { name: "MSIE", regex: /MSIE ([0-9.]+)/ }, // For IE 8 and earlier
    { name: "Trident", regex: /Trident\/([0-9.]+)/ }, // For IE 11
    { name: "Opera", regex: /Opera\/([0-9.]+)/ },
    { name: "Postman", regex: /PostmanRuntime\/([0-9.]+)/ }, // Postman
    { name: "Curl", regex: /curl\/([0-9.]+)/ }, // curl
  ];

  const osPatterns = [
    { name: "Windows", regex: /Windows NT/ },
    { name: "macOS", regex: /Mac OS X/ },
    { name: "Linux", regex: /Linux/ },
    { name: "Android", regex: /Android/ },
    { name: "iOS", regex: /iPhone|iPad|iPod/ },
  ];

  // Extract browser name
  for (const { name, regex } of browserPatterns) {
    if (regex.test(userAgent)) {
      browserName = name;
      break;
    }
  }

  // Extract OS name
  for (const { name, regex } of osPatterns) {
    if (regex.test(userAgent)) {
      osName = name;
      break;
    }
  }

  // if osName is still unknown, try to get it from os module
  if (osName === "Unknown OS") {
    osName = os.type();
  }

  return `${browserName} on ${osName}`;
};
