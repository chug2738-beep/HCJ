$(function () {
    // --- State Management ---
    const state = {
        files: [],
        currentRatio: {
            type: '1:1',
            w: 1,
            h: 1,
            value: 1
        },
        currentMode: 'padding',
        currentBgColor: '#ffffff',
        currentSize: 'origin',
        customSizeValue: null,
        isProcessing: false
    };

    // --- DOM Elements Cache ---
    const $dropZone = $('#drop-zone');
    const $fileInput = $('#file-input');
    const $fileSelectBtn = $('#file-select-btn');
    const $ratioBtns = $('.ratio-btn');
    const $customRatioBtn = $('#custom-ratio-btn');
    const $customRatioContainer = $('#custom-ratio-container');
    const $customWidth = $('#custom-width');
    const $customHeight = $('#custom-height');
    const $modeRadios = $('input[name="resize-mode"]');
    const $bgColorControl = $('#bg-color-control');
    const $bgColorInput = $('#bg-color-input');
    const $bgColorHex = $('#bg-color-hex');
    const $presetColorBtns = $('.preset-color-btn');
    const $sizeBtns = $('.size-btn');
    const $customSizeBtn = $('#custom-size-btn');
    const $customSizeContainer = $('#custom-size-container');
    const $customLongSide = $('#custom-long-side');
    const $resultsSection = $('#results-section');
    const $resultsCounter = $('#results-counter');
    const $imageList = $('#image-list');
    const $reprocessBtn = $('#reprocess-btn');
    const $downloadAllBtn = $('#download-all-btn');

    // --- Upload Trigger Events ---
    $fileSelectBtn.on('click', function (e) {
        e.stopPropagation();
        $fileInput.trigger('click');
    });

    $dropZone.on('click', function (e) {
        if ($(e.target).closest('button, input').length === 0) {
            $fileInput.trigger('click');
        }
    });

    $fileInput.on('change', function (e) {
        handleFiles(e.target.files);
        $fileInput.val('');
    });

    // Drag and Drop Visual Feedback
    $dropZone.on('dragover dragenter', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $dropZone.addClass('border-indigo-600 bg-indigo-50/60 scale-[1.01]');
    });

    $dropZone.on('dragleave dragend drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $dropZone.removeClass('border-indigo-600 bg-indigo-50/60 scale-[1.01]');
    });

    $dropZone.on('drop', function (e) {
        const dt = e.originalEvent.dataTransfer;
        if (dt && dt.files && dt.files.length > 0) {
            handleFiles(dt.files);
        }
    });

    // --- Aspect Ratio Selection ---
    $ratioBtns.on('click', function () {
        $ratioBtns
            .removeClass('active bg-indigo-600 text-white border-indigo-600 shadow-sm')
            .addClass('bg-white text-slate-700 border-slate-200');
        
        $(this)
            .addClass('active bg-indigo-600 text-white border-indigo-600 shadow-sm')
            .removeClass('bg-white text-slate-700 border-slate-200');

        const ratioAttr = $(this).data('ratio');
        if (ratioAttr) {
            $customRatioContainer.addClass('hidden');
            const parts = ratioAttr.split(':').map(Number);
            state.currentRatio = {
                type: ratioAttr,
                w: parts[0],
                h: parts[1],
                value: parts[0] / parts[1]
            };
            triggerBatchReprocess();
        } else if ($(this).attr('id') === 'custom-ratio-btn') {
            $customRatioContainer.removeClass('hidden');
            state.currentRatio.type = 'custom';
            updateCustomRatio();
        }
    });

    $customWidth.add($customHeight).on('input', function () {
        updateCustomRatio();
    });

    function updateCustomRatio() {
        const w = parseFloat($customWidth.val());
        const h = parseFloat($customHeight.val());
        if (w > 0 && h > 0) {
            state.currentRatio = {
                type: 'custom',
                w: w,
                h: h,
                value: w / h
            };
            triggerBatchReprocess();
        }
    }

    // --- Resize Mode Selection ---
    $modeRadios.on('change', function () {
        const selectedMode = $(this).val();
        state.currentMode = selectedMode;

        $('.radio-card')
            .removeClass('active border-indigo-600 bg-indigo-50/50')
            .addClass('border-slate-200 bg-white');

        $(this).closest('.radio-card')
            .addClass('active border-indigo-600 bg-indigo-50/50')
            .removeClass('border-slate-200 bg-white');

        if (selectedMode === 'padding') {
            $bgColorControl.slideDown(200);
        } else {
            $bgColorControl.slideUp(200);
        }
        triggerBatchReprocess();
    });

    // --- Background Color Controls ---
    $bgColorInput.on('input change', function () {
        const color = $(this).val();
        state.currentBgColor = color;
        $bgColorHex.text(color.toUpperCase());
        $presetColorBtns.removeClass('border-indigo-600 active').addClass('border-slate-300');
        $presetColorBtns.filter(`[data-color="${color.toLowerCase()}"]`).addClass('border-indigo-600 active').removeClass('border-slate-300');
        if (state.currentMode === 'padding') {
            triggerBatchReprocess();
        }
    });

    $presetColorBtns.on('click', function () {
        const color = $(this).data('color');
        $presetColorBtns.removeClass('border-indigo-600 active').addClass('border-slate-300');
        $(this).addClass('border-indigo-600 active').removeClass('border-slate-300');
        $bgColorInput.val(color);
        $bgColorHex.text(color.toUpperCase());
        state.currentBgColor = color;
        if (state.currentMode === 'padding') {
            triggerBatchReprocess();
        }
    });

    // --- Output Resolution (Long Axis) ---
    $sizeBtns.on('click', function () {
        $sizeBtns
            .removeClass('active bg-indigo-600 text-white border-indigo-600 shadow-sm')
            .addClass('bg-white text-slate-700 border-slate-200');
        
        $(this)
            .addClass('active bg-indigo-600 text-white border-indigo-600 shadow-sm')
            .removeClass('bg-white text-slate-700 border-slate-200');

        const sizeAttr = $(this).data('size');
        if (sizeAttr) {
            $customSizeContainer.addClass('hidden');
            state.currentSize = sizeAttr;
            state.customSizeValue = (sizeAttr === 'origin') ? null : Number(sizeAttr);
            triggerBatchReprocess();
        } else if ($(this).attr('id') === 'custom-size-btn') {
            $customSizeContainer.removeClass('hidden');
            state.currentSize = 'custom';
            updateCustomSize();
        }
    });

    $customLongSide.on('input', function () {
        updateCustomSize();
    });

    function updateCustomSize() {
        const val = parseFloat($customLongSide.val());
        if (val > 0) {
            state.customSizeValue = val;
            triggerBatchReprocess();
        }
    }

    // Reprocess Button
    $reprocessBtn.on('click', function () {
        reprocessAllFiles();
    });

    // Download All (ZIP)
    $downloadAllBtn.on('click', function () {
        createAndDownloadZip();
    });


    // --- File Handling & Queue Management ---

    function handleFiles(fileList) {
        const validFiles = Array.from(fileList).filter(file => file.type.startsWith('image/'));
        if (validFiles.length === 0) return;

        $resultsSection.removeClass('hidden');

        validFiles.forEach(file => {
            const item = {
                id: 'img_' + Math.random().toString(36).substring(2, 11),
                file: file,
                name: file.name,
                sizeText: formatBytes(file.size),
                status: 'pending',
                progress: 0,
                processedBlob: null,
                processedUrl: null,
                outputDimensions: ''
            };

            state.files.push(item);
            renderItemElement(item);
            processSingleFile(item);
        });

        updateResultsHeader();
    }

    function renderItemElement(item) {
        const initialThumbUrl = URL.createObjectURL(item.file);

        const html = `
            <div class="image-item bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 hover:border-indigo-200 hover:bg-slate-50/80 shadow-xs" id="card-${item.id}">
                <div class="flex items-center gap-3.5 w-full sm:w-auto flex-1 min-w-0">
                    <!-- Thumbnail with checkerboard -->
                    <div class="checkerboard-bg w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-slate-200 shadow-xs flex-shrink-0 flex items-center justify-center">
                        <img src="${initialThumbUrl}" alt="미리보기" class="w-full h-full object-contain" id="thumb-${item.id}">
                    </div>

                    <!-- Info & Progress Container -->
                    <div class="flex-1 min-w-0 flex flex-col gap-1.5">
                        <div class="flex items-center justify-between gap-2">
                            <span class="font-bold text-slate-800 text-xs sm:text-sm truncate" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
                            <div class="flex items-center gap-1.5 flex-shrink-0">
                                <span class="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">${item.sizeText}</span>
                                <span class="text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md" id="spec-${item.id}">대기 중</span>
                            </div>
                        </div>

                        <!-- Progress Bar & Status -->
                        <div class="flex items-center gap-2.5">
                            <div class="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div class="progress-bar h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300 shimmer-bar" id="bar-${item.id}" style="width: 0%;"></div>
                            </div>
                            <span class="text-xs font-mono font-bold text-slate-500 min-w-[36px] text-right" id="status-${item.id}">0%</span>
                        </div>
                    </div>
                </div>

                <!-- Individual Download Button -->
                <div class="w-full sm:w-auto flex justify-end flex-shrink-0">
                    <a href="#" class="btn-download-item w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-none transition-all duration-200" id="down-${item.id}" download="resized_${item.name}">
                        <i class="fa-solid fa-download"></i>
                        다운로드
                    </a>
                </div>
            </div>
        `;

        $imageList.append(html);
    }

    function updateResultsHeader() {
        const total = state.files.length;
        $resultsCounter.text(`총 ${total}개 파일 등록됨`);
    }

    // --- Image Processing Algorithm ---

    async function processSingleFile(item) {
        item.status = 'processing';
        updateItemProgress(item.id, 20, '로딩 중');

        try {
            const img = await loadImageFromFile(item.file);
            updateItemProgress(item.id, 50, '연산 중');

            await sleep(80);

            const result = renderCanvas(img);
            updateItemProgress(item.id, 80, '인코딩 중');

            await sleep(60);

            const blob = await canvasToBlob(result.canvas, item.file.type);
            updateItemProgress(item.id, 100, '완료');

            // Store result
            item.processedBlob = blob;
            if (item.processedUrl) {
                URL.revokeObjectURL(item.processedUrl);
            }
            item.processedUrl = URL.createObjectURL(blob);
            item.outputDimensions = `${result.targetW}x${result.targetH}`;
            item.status = 'completed';

            // Update UI
            $(`#spec-${item.id}`).text(`${result.targetW}x${result.targetH}`);
            $(`#thumb-${item.id}`).attr('src', item.processedUrl);

            const $downBtn = $(`#down-${item.id}`);
            $downBtn
                .attr('href', item.processedUrl)
                .attr('download', getExportFilename(item.name, result.targetW, result.targetH))
                .removeClass('bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-none border-slate-200')
                .addClass('bg-indigo-600 hover:bg-indigo-700 text-white opacity-100 cursor-pointer pointer-events-auto shadow-sm hover:shadow-indigo-200 hover:-translate-y-0.5 border-transparent');

            checkAllCompleted();

        } catch (err) {
            console.error('이미지 변환 실패:', item.name, err);
            item.status = 'error';
            updateItemProgress(item.id, 0, '오류');
        }
    }

    function renderCanvas(img) {
        const srcW = img.naturalWidth || img.width;
        const srcH = img.naturalHeight || img.height;
        const targetRatio = state.currentRatio.value;

        let targetW, targetH;

        if (state.currentSize === 'origin') {
            if (state.currentMode === 'padding') {
                const srcRatio = srcW / srcH;
                if (srcRatio > targetRatio) {
                    targetW = srcW;
                    targetH = Math.round(srcW / targetRatio);
                } else {
                    targetH = srcH;
                    targetW = Math.round(srcH * targetRatio);
                }
            } else {
                const srcRatio = srcW / srcH;
                if (srcRatio > targetRatio) {
                    targetH = srcH;
                    targetW = Math.round(srcH * targetRatio);
                } else {
                    targetW = srcW;
                    targetH = Math.round(srcW / targetRatio);
                }
            }
        } else {
            let longSide = (state.currentSize === 'custom') ? (state.customSizeValue || 1200) : Number(state.currentSize);
            if (targetRatio >= 1) {
                targetW = longSide;
                targetH = Math.round(longSide / targetRatio);
            } else {
                targetH = longSide;
                targetW = Math.round(longSide * targetRatio);
            }
        }

        targetW = Math.max(1, Math.round(targetW));
        targetH = Math.max(1, Math.round(targetH));

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        let drawX, drawY, drawW, drawH;

        if (state.currentMode === 'padding') {
            ctx.fillStyle = state.currentBgColor || '#ffffff';
            ctx.fillRect(0, 0, targetW, targetH);

            const scale = Math.min(targetW / srcW, targetH / srcH);
            drawW = srcW * scale;
            drawH = srcH * scale;
            drawX = (targetW - drawW) / 2;
            drawY = (targetH - drawH) / 2;

            ctx.drawImage(img, drawX, drawY, drawW, drawH);
        } else {
            const scale = Math.max(targetW / srcW, targetH / srcH);
            drawW = srcW * scale;
            drawH = srcH * scale;
            drawX = (targetW - drawW) / 2;
            drawY = (targetH - drawH) / 2;

            ctx.drawImage(img, drawX, drawY, drawW, drawH);
        }

        return { canvas, targetW, targetH };
    }

    function updateItemProgress(id, percent, statusText) {
        const $bar = $(`#bar-${id}`);
        const $status = $(`#status-${id}`);

        if ($bar.length) {
            $bar.css('width', `${percent}%`);
            if (percent === 100) {
                $bar.removeClass('from-indigo-500 to-purple-600 shimmer-bar').addClass('bg-emerald-500');
                $status.addClass('text-emerald-600').removeClass('text-slate-500').text('100%');
            } else {
                $bar.addClass('from-indigo-500 to-purple-600 shimmer-bar').removeClass('bg-emerald-500');
                $status.removeClass('text-emerald-600').addClass('text-slate-500').text(`${percent}%`);
            }
        }
    }

    function checkAllCompleted() {
        if (state.files.length === 0) {
            $downloadAllBtn.prop('disabled', true);
            return;
        }

        const allDone = state.files.every(f => f.status === 'completed');
        if (allDone) {
            $downloadAllBtn.prop('disabled', false);
        } else {
            $downloadAllBtn.prop('disabled', true);
        }
    }

    // Debounced Batch Reprocess
    let reprocessTimer = null;
    function triggerBatchReprocess() {
        if (state.files.length === 0) return;
        clearTimeout(reprocessTimer);
        reprocessTimer = setTimeout(() => {
            reprocessAllFiles();
        }, 150);
    }

    function reprocessAllFiles() {
        if (state.files.length === 0) return;

        $downloadAllBtn.prop('disabled', true);

        state.files.forEach(item => {
            const $downBtn = $(`#down-${item.id}`);
            $downBtn
                .addClass('bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-none border-slate-200')
                .removeClass('bg-indigo-600 hover:bg-indigo-700 text-white opacity-100 cursor-pointer pointer-events-auto shadow-sm hover:shadow-indigo-200 hover:-translate-y-0.5 border-transparent');
            
            updateItemProgress(item.id, 0, '대기 중');
            processSingleFile(item);
        });
    }

    // --- ZIP Archiving & Download ---

    async function createAndDownloadZip() {
        if (state.files.length === 0) return;

        const originalBtnHtml = $downloadAllBtn.html();
        $downloadAllBtn.prop('disabled', true).html(`
            <i class="fa-solid fa-spinner fa-spin"></i>
            압축 파일 생성 중...
        `);

        try {
            const zip = new JSZip();
            const usedNames = new Set();

            state.files.forEach(item => {
                if (item.processedBlob) {
                    let filename = getExportFilename(item.name, null, null);
                    let count = 1;
                    const baseName = filename.replace(/\.[^/.]+$/, '');
                    const ext = filename.split('.').pop();

                    while (usedNames.has(filename)) {
                        filename = `${baseName}_(${count}).${ext}`;
                        count++;
                    }
                    usedNames.add(filename);

                    zip.file(filename, item.processedBlob);
                }
            });

            const zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });

            saveAs(zipBlob, 'smart_resized_images.zip');

        } catch (err) {
            console.error('ZIP 생성 실패:', err);
            alert('ZIP 파일 생성 중 오류가 발생했습니다.');
        } finally {
            $downloadAllBtn.prop('disabled', false).html(originalBtnHtml);
        }
    }

    // --- Helper Functions ---

    function loadImageFromFile(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            img.onerror = (e) => {
                URL.revokeObjectURL(url);
                reject(e);
            };
            img.src = url;
        });
    }

    function canvasToBlob(canvas, mimeType) {
        return new Promise((resolve) => {
            const validMime = (mimeType && mimeType.startsWith('image/')) ? mimeType : 'image/png';
            canvas.toBlob((blob) => {
                resolve(blob);
            }, validMime, 0.95);
        });
    }

    function getExportFilename(originalName, w, h) {
        const dotIndex = originalName.lastIndexOf('.');
        const nameWithoutExt = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
        const ext = dotIndex !== -1 ? originalName.substring(dotIndex) : '.png';
        const modeLabel = state.currentMode === 'padding' ? 'pad' : 'crop';
        const ratioLabel = state.currentRatio.type.replace(':', '_');

        if (w && h) {
            return `resized_${nameWithoutExt}_${ratioLabel}_${modeLabel}_${w}x${h}${ext}`;
        }
        return `resized_${nameWithoutExt}_${ratioLabel}_${modeLabel}${ext}`;
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
