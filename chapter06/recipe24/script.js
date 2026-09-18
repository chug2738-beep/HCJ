document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const charCountEl = document.getElementById('charCount');
    const byteCountEl = document.getElementById('byteCount');
    const spaceCountEl = document.getElementById('spaceCount');

    // Function to calculate string byte length with specific logic for Hangul
    // Rule: Hangul characters = 2 bytes. ASCII = 1 byte.
    // Generally, in many contexts (like EUC-KR), Korean is 2 bytes.
    // In UTF-8, Korean is actually 3 bytes.
    // But the user SPECIFICALLY asked for "Hangul is 2byte".
    function getByteLength(str) {
        let byteLen = 0;
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            
            // Check for Korean characters (Hangul Syllables, Jamo, Compatibility Jamo)
            // Hangul Syllables: AC00-D7A3
            // Hangul Jamo: 1100-11FF
            // Hangul Compatibility Jamo: 3130-318F
            // Also CJK Unified Ideographs commonly treated as 2 bytes in legacy encodings: 4E00-9FFF
            // General rule for "2 byte" legacy context is usually: charCode > 127 ? 2 : 1
            // But let's be technically robust if they want specifically Hangul to be 2.
            
            // Simple heuristic matching user request "Hangul is 2byte":
            // We can just assume all non-ASCII are 2 bytes to simulate that old school counting,
            // or strictly check ranges.
            // Let's go with the broader common standard for "multibyte counting":
            // if (code > 127) +2 else +1
            
            if (charCode > 127) {
                byteLen += 2;
            } else {
                byteLen += 1;
            }
        }
        return byteLen;
    }

    function updateCounts() {
        const text = textInput.value;
        const length = text.length;
        const bytes = getByteLength(text);
        const noSpaceLength = text.replace(/\s/g, '').length;

        // Animate numbers (simple visual effect)
        charCountEl.textContent = length.toLocaleString();
        byteCountEl.textContent = bytes.toLocaleString();
        spaceCountEl.textContent = noSpaceLength.toLocaleString();
    }

    textInput.addEventListener('input', updateCounts);
    
    // Initial call
    updateCounts();
});
