// content.js

const getImageDataAsBase64 = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error(`DevAura Error: Could not process image at ${url}`, error);
        return null;
    }
};

const analyzePageForImages = async () => {
    console.log("DevAura: Scanning page for images without alt text...");
    const images = document.querySelectorAll('img:not([alt]), img[alt=""]');
    const imageProcessingPromises = [];

    images.forEach(img => {
        if (img.naturalWidth > 50 && img.naturalHeight > 50 && img.src) {
            const promise = getImageDataAsBase64(img.src).then(base64Data => {
                if (base64Data) {
                    return {
                        src: img.src,
                        base64Data: base64Data
                    };
                }
                return null;
            });
            imageProcessingPromises.push(promise);
        }
    });

    const imageDataArray = (await Promise.all(imageProcessingPromises)).filter(Boolean);

    if (imageDataArray.length > 0) {
        chrome.runtime.sendMessage({
            type: 'ANALYZE_IMAGES',
            payload: imageDataArray
        });
    } else {
        chrome.runtime.sendMessage({ type: 'NO_IMAGES_FOUND' });
    }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SCAN_PAGE') {
        analyzePageForImages();
        sendResponse({ status: "scan-started" });
    }
    return true;
});