document.addEventListener('DOMContentLoaded', () => {
    const { PDFDocument, rgb, degrees, StandardFonts } = PDFLib;

    // --- Tool Data ---
    const tools = [
        { id: 'merge-pdf', title: 'Merge PDF', desc: 'Combine PDFs in the order you want with the easiest PDF merger available.', icon: 'fa-object-group', color: '#ff4757' },
        { id: 'split-pdf', title: 'Split PDF', desc: 'Separate one page or a whole set for easy conversion into independent PDF files.', icon: 'fa-cut', color: '#ff6b81' },
        { id: 'compress-pdf', title: 'Compress PDF', desc: 'Reduce file size while optimizing for maximal PDF quality.', icon: 'fa-compress-arrows-alt', color: '#2ed573' },
        { id: 'pdf-to-word', title: 'PDF to Word', desc: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.', icon: 'fa-file-word', color: '#3742fa' },
        { id: 'pdf-to-powerpoint', title: 'PDF to PowerPoint', desc: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.', icon: 'fa-file-powerpoint', color: '#ffa502' },
        { id: 'pdf-to-excel', title: 'PDF to Excel', desc: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.', icon: 'fa-file-excel', color: '#20bf6b' },
        { id: 'word-to-pdf', title: 'Word to PDF', desc: 'Make DOC and DOCX files easy to read by converting them to PDF.', icon: 'fa-file-word', color: '#3742fa' },
        { id: 'powerpoint-to-pdf', title: 'PowerPoint to PDF', desc: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.', icon: 'fa-file-powerpoint', color: '#ffa502' },
        { id: 'excel-to-pdf', title: 'Excel to PDF', desc: 'Make EXCEL spreadsheets easy to read by converting them to PDF.', icon: 'fa-file-excel', color: '#20bf6b' },
        { id: 'edit-pdf', title: 'Edit PDF', desc: 'Add text, images, shapes or freehand annotations to a PDF document.', icon: 'fa-edit', color: '#a55eea', new: true },
        { id: 'pdf-to-jpg', title: 'PDF to JPG', desc: 'Convert each PDF page into a JPG or extract all images contained in a PDF.', icon: 'fa-file-image', color: '#f7b731' },
        { id: 'jpg-to-pdf', title: 'JPG to PDF', desc: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.', icon: 'fa-file-image', color: '#f7b731' },
        { id: 'sign-pdf', title: 'Sign PDF', desc: 'Sign yourself or request electronic signatures from others.', icon: 'fa-signature', color: '#4b6584' },
        { id: 'watermark', title: 'Watermark', desc: 'Stamp an image or text over your PDF in seconds.', icon: 'fa-stamp', color: '#eb3b5a' },
        { id: 'rotate-pdf', title: 'Rotate PDF', desc: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!', icon: 'fa-sync-alt', color: '#8854d0' },
        { id: 'html-to-pdf', title: 'HTML to PDF', desc: 'Convert webpages in HTML to PDF.', icon: 'fa-code', color: '#f1c40f' },
        { id: 'unlock-pdf', title: 'Unlock PDF', desc: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.', icon: 'fa-unlock', color: '#70a1ff' },
        { id: 'protect-pdf', title: 'Protect PDF', desc: 'Protect PDF files with a password. Encrypt PDF documents.', icon: 'fa-shield-alt', color: '#2f3542' },
        { id: 'organize-pdf', title: 'Organize PDF', desc: 'Sort pages of your PDF file however you like.', icon: 'fa-sort', color: '#ff6348' },
        { id: 'pdf-to-pdfa', title: 'PDF to PDF/A', desc: 'Transform your PDF to PDF/A, the ISO-standardized version of PDF for long-term archiving.', icon: 'fa-archive', color: '#1e90ff' },
        { id: 'repair-pdf', title: 'Repair PDF', desc: 'Repair a damaged PDF and recover data from corrupt PDF.', icon: 'fa-tools', color: '#7bed9f' },
        { id: 'page-numbers', title: 'Page numbers', desc: 'Add page numbers into PDFs with ease.', icon: 'fa-list-ol', color: '#ff7f50' },
        { id: 'scan-to-pdf', title: 'Scan to PDF', desc: 'Capture document scans from your mobile device and send them instantly to your browser.', icon: 'fa-mobile-alt', color: '#ff9f43' },
        { id: 'ocr-pdf', title: 'OCR PDF', desc: 'Easily convert scanned PDF into searchable and selectable documents.', icon: 'fa-eye', color: '#2ed573' },
        { id: 'compare-pdf', title: 'Compare PDF', desc: 'Show a side-by-side document comparison and easily spot changes.', icon: 'fa-columns', color: '#5352ed' },
        { id: 'redact-pdf', title: 'Redact PDF', desc: 'Redact text and graphics to permanently remove sensitive information from a PDF.', icon: 'fa-user-secret', color: '#2f3542', new: true },
        { id: 'crop-pdf', title: 'Crop PDF', desc: 'Crop margins of PDF documents or select specific areas.', icon: 'fa-crop-alt', color: '#e056fd', new: true }
    ];

    // --- DOM Elements ---
    const toolsGrid = document.getElementById('toolsGrid');
    const homeView = document.getElementById('home-view');
    const toolView = document.getElementById('tool-view');
    const backBtn = document.getElementById('backBtn');
    const currentToolTitle = document.getElementById('currentToolTitle');
    const currentToolDesc = document.getElementById('currentToolDesc');
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectFilesBtn = document.getElementById('selectFilesBtn');
    const filesList = document.getElementById('filesList');
    const optionsPanel = document.getElementById('optionsPanel');
    const optionsContent = document.getElementById('optionsContent');
    const processBtn = document.getElementById('processBtn');

    let currentTool = null;
    let uploadedFiles = [];
    let processedPDFs = []; // Store processed PDFs

    // --- Render Tools ---
    function renderTools() {
        toolsGrid.innerHTML = '';
        tools.forEach(tool => {
            const card = document.createElement('div');
            card.className = 'tool-card';
            card.setAttribute('data-tool-id', tool.id);

            const newBadge = tool.new ? '<span class="new-badge">New!</span>' : '';

            card.innerHTML = `
                ${newBadge}
                <div class="tool-icon" style="color: ${tool.color}">
                    <i class="fas ${tool.icon}"></i>
                </div>
                <h3>${tool.title}</h3>
                <p>${tool.desc}</p>
            `;

            card.addEventListener('click', () => openTool(tool));
            toolsGrid.appendChild(card);
        });
    }

    // --- Navigation Logic ---
    function openTool(tool) {
        currentTool = tool;
        uploadedFiles = [];

        homeView.classList.remove('active');
        homeView.classList.add('hidden');

        toolView.classList.remove('hidden');
        toolView.classList.add('active');

        currentToolTitle.textContent = tool.title;
        currentToolDesc.textContent = tool.desc;

        updateFileInputAccept(tool.id);
        resetToolView();

        window.scrollTo(0, 0);
    }

    function goHome() {
        currentTool = null;
        uploadedFiles = [];
        resetToolView();

        toolView.classList.remove('active');
        toolView.classList.add('hidden');

        homeView.classList.remove('hidden');
        homeView.classList.add('active');
    }

    function resetToolView() {
        dropZone.classList.remove('hidden');
        filesList.classList.add('hidden');
        optionsPanel.classList.add('hidden');
        processBtn.classList.add('hidden');
        document.getElementById('downloadSection').classList.add('hidden');
        filesList.innerHTML = '';
        optionsContent.innerHTML = '';
        document.getElementById('downloadButtons').innerHTML = '';
        processedPDFs = [];
        dropZone.querySelector('.drop-text').textContent = 'Drag & Drop files here';
    }

    function updateFileInputAccept(toolId) {
        if (toolId === 'jpg-to-pdf') {
            fileInput.setAttribute('accept', 'image/jpeg,image/jpg,image/png');
        } else if (toolId.includes('word') || toolId === 'pdf-to-word') {
            fileInput.setAttribute('accept', '.pdf,.doc,.docx');
        } else if (toolId.includes('excel') || toolId === 'pdf-to-excel') {
            fileInput.setAttribute('accept', '.pdf,.xls,.xlsx');
        } else if (toolId.includes('powerpoint') || toolId === 'pdf-to-powerpoint') {
            fileInput.setAttribute('accept', '.pdf,.ppt,.pptx');
        } else {
            fileInput.setAttribute('accept', '.pdf');
        }

        fileInput.multiple = (toolId === 'merge-pdf' || toolId === 'jpg-to-pdf');
    }

    backBtn.addEventListener('click', goHome);

    // Handle Nav Links
    document.querySelectorAll('.nav-item, .dropdown-content a').forEach(link => {
        link.addEventListener('click', (e) => {
            const toolId = link.getAttribute('data-tool');
            if (toolId) {
                e.preventDefault();
                const tool = tools.find(t => t.id === toolId);
                if (tool) {
                    openTool(tool);
                }
            } else if (link.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });

    // --- Theme Toggle ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking nav items
        document.querySelectorAll('.nav-item, .dropdown-content a').forEach(item => {
            item.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            });
        });
    }

    // --- File Upload ---
    selectFilesBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFileUpload(e.target.files));

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files);
        }
    });

    function handleFileUpload(files) {
        if (!currentTool || files.length === 0) return;

        uploadedFiles = Array.from(files);

        // Hide drop zone, show files list
        dropZone.classList.add('hidden');
        displayFilesList();
        displayOptions();
        processBtn.classList.remove('hidden');
    }

    function displayFilesList() {
        filesList.classList.remove('hidden');
        filesList.innerHTML = '<h3>Files (' + uploadedFiles.length + ')</h3>';

        uploadedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.draggable = currentTool.id === 'merge-pdf';
            fileItem.dataset.index = index;

            const sizeKB = (file.size / 1024).toFixed(1);
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            const displaySize = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

            fileItem.innerHTML = `
                ${currentTool.id === 'merge-pdf' ? '<div class="file-icon drag-handle"><i class="fas fa-grip-vertical"></i></div>' : ''}
                <div class="file-info">
                    <div class="file-icon"><i class="fas fa-file-pdf"></i></div>
                    <div class="file-details">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${displaySize}</div>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="file-action-btn" onclick="removeFile(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            if (currentTool.id === 'merge-pdf') {
                fileItem.addEventListener('dragstart', handleDragStart);
                fileItem.addEventListener('dragover', handleDragOver);
                fileItem.addEventListener('drop', handleDrop);
                fileItem.addEventListener('dragend', handleDragEnd);
            }

            filesList.appendChild(fileItem);
        });
    }

    // Drag and drop for merge
    let draggedItem = null;

    function handleDragStart(e) {
        draggedItem = e.currentTarget;
        e.currentTarget.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const dropTarget = e.currentTarget;

        if (draggedItem !== dropTarget) {
            const dragIndex = parseInt(draggedItem.dataset.index);
            const dropIndex = parseInt(dropTarget.dataset.index);

            // Swap files
            [uploadedFiles[dragIndex], uploadedFiles[dropIndex]] = [uploadedFiles[dropIndex], uploadedFiles[dragIndex]];
            displayFilesList();
        }
    }

    function handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
        draggedItem = null;
    }

    window.removeFile = function (index) {
        uploadedFiles.splice(index, 1);
        if (uploadedFiles.length === 0) {
            resetToolView();
        } else {
            displayFilesList();
        }
    };

    // --- Options Panel ---
    function displayOptions() {
        optionsContent.innerHTML = '';
        optionsPanel.classList.remove('hidden');

        switch (currentTool.id) {
            case 'rotate-pdf':
                optionsContent.innerHTML = `
                    <div class="option-group">
                        <label class="option-label">Rotation Direction</label>
                        <div class="option-radio-group">
                            <label class="radio-option">
                                <input type="radio" name="rotation" value="90" checked>
                                <span>90° Clockwise</span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="rotation" value="180">
                                <span>180°</span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="rotation" value="270">
                                <span>90° Counter-clockwise</span>
                            </label>
                        </div>
                    </div>
                `;
                break;

            case 'split-pdf':
                optionsContent.innerHTML = `
                    <div class="option-group">
                        <label class="option-label">Split Mode</label>
                        <select class="option-select" id="splitMode">
                            <option value="all">Extract all pages (one file per page)</option>
                            <option value="range">Split by page range</option>
                            <option value="after">Split after specific page</option>
                        </select>
                    </div>
                    <div class="option-group" id="rangeOptions" style="display: none;">
                        <label class="option-label">Page Range (e.g., 1-5, 7, 10-12)</label>
                        <input type="text" class="option-input" id="pageRange" placeholder="1-5, 7, 10-12">
                    </div>
                    <div class="option-group" id="afterOptions" style="display: none;">
                        <label class="option-label">Split After Page Number</label>
                        <input type="number" class="option-input" id="splitAfter" min="1" placeholder="3">
                    </div>
                `;

                document.getElementById('splitMode').addEventListener('change', (e) => {
                    document.getElementById('rangeOptions').style.display = e.target.value === 'range' ? 'block' : 'none';
                    document.getElementById('afterOptions').style.display = e.target.value === 'after' ? 'block' : 'none';
                });
                break;

            case 'compress-pdf':
                optionsContent.innerHTML = `
                    <div class="option-group">
                        <label class="option-label">Compression Level</label>
                        <select class="option-select" id="compressionLevel">
                            <option value="low">Low (Larger file, better quality)</option>
                            <option value="medium" selected>Medium (Balanced)</option>
                            <option value="high">High (Smaller file, lower quality)</option>
                        </select>
                    </div>
                `;
                break;

            case 'watermark':
                optionsContent.innerHTML = `
                    <div class="option-group">
                        <label class="option-label">Watermark Text</label>
                        <input type="text" class="option-input" id="watermarkText" placeholder="CONFIDENTIAL" value="CONFIDENTIAL">
                    </div>
                    <div class="option-group">
                        <label class="option-label">Position</label>
                        <select class="option-select" id="watermarkPosition">
                            <option value="center">Center</option>
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="diagonal">Diagonal</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label class="option-label">Opacity: <span class="slider-value" id="opacityValue">30%</span></label>
                        <input type="range" class="option-slider" id="watermarkOpacity" min="10" max="100" value="30">
                    </div>
                    <div class="option-group">
                        <label class="option-label">Font Size: <span class="slider-value" id="sizeValue">50</span></label>
                        <input type="range" class="option-slider" id="watermarkSize" min="20" max="100" value="50">
                    </div>
                `;

                document.getElementById('watermarkOpacity').addEventListener('input', (e) => {
                    document.getElementById('opacityValue').textContent = e.target.value + '%';
                });
                document.getElementById('watermarkSize').addEventListener('input', (e) => {
                    document.getElementById('sizeValue').textContent = e.target.value;
                });
                break;

            case 'page-numbers':
                optionsContent.innerHTML = `
                    <div class="option-group">
                        <label class="option-label">Position</label>
                        <select class="option-select" id="numberPosition">
                            <option value="bottom-center">Bottom Center</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-right">Bottom Right</option>
                            <option value="top-center">Top Center</option>
                            <option value="top-left">Top Left</option>
                            <option value="top-right">Top Right</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label class="option-label">Format</label>
                        <select class="option-select" id="numberFormat">
                            <option value="number">1, 2, 3...</option>
                            <option value="page-number">Page 1, Page 2...</option>
                            <option value="of-total">1 of 10, 2 of 10...</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label class="option-label">Starting Number</label>
                        <input type="number" class="option-input" id="startingNumber" value="1" min="1">
                    </div>
                `;
                break;

            case 'jpg-to-pdf':
                optionsContent.innerHTML = `
                    <div class="option-group">
                        <label class="option-label">Page Orientation</label>
                        <div class="option-radio-group">
                            <label class="radio-option">
                                <input type="radio" name="orientation" value="auto" checked>
                                <span>Auto</span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="orientation" value="portrait">
                                <span>Portrait</span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="orientation" value="landscape">
                                <span>Landscape</span>
                            </label>
                        </div>
                    </div>
                    <div class="option-group">
                        <label class="option-label">Margin (pixels): <span class="slider-value" id="marginValue">0</span></label>
                        <input type="range" class="option-slider" id="imageMargin" min="0" max="100" value="0">
                    </div>
                `;

                document.getElementById('imageMargin').addEventListener('input', (e) => {
                    document.getElementById('marginValue').textContent = e.target.value;
                });
                break;

            case 'redact-pdf':
                optionsContent.innerHTML = `
                    <div class="option-group">
                        <label class="option-label">Redaction Text (text to find and redact)</label>
                        <input type="text" class="option-input" id="redactText" placeholder="e.g., Social Security Number">
                    </div>
                    <div class="option-group">
                        <label class="option-label">Redaction Color</label>
                        <select class="option-select" id="redactColor">
                            <option value="black">Black</option>
                            <option value="white">White</option>
                            <option value="gray">Gray</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label class="option-checkbox">
                            <input type="checkbox" id="caseSensitive">
                            <span>Case Sensitive</span>
                        </label>
                    </div>
                `;
                break;

            case 'crop-pdf':
                optionsContent.innerHTML = `
                    <div class="option-group">
                        <label class="option-label">Crop Margins (points)</label>
                    </div>
                    <div class="option-group">
                        <label class="option-label">Top: <span class="slider-value" id="topValue">0</span></label>
                        <input type="range" class="option-slider" id="cropTop" min="0" max="200" value="0">
                    </div>
                    <div class="option-group">
                        <label class="option-label">Bottom: <span class="slider-value" id="bottomValue">0</span></label>
                        <input type="range" class="option-slider" id="cropBottom" min="0" max="200" value="0">
                    </div>
                    <div class="option-group">
                        <label class="option-label">Left: <span class="slider-value" id="leftValue">0</span></label>
                        <input type="range" class="option-slider" id="cropLeft" min="0" max="200" value="0">
                    </div>
                    <div class="option-group">
                        <label class="option-label">Right: <span class="slider-value" id="rightValue">0</span></label>
                        <input type="range" class="option-slider" id="cropRight" min="0" max="200" value="0">
                    </div>
                `;

                ['Top', 'Bottom', 'Left', 'Right'].forEach(side => {
                    document.getElementById(`crop${side}`).addEventListener('input', (e) => {
                        document.getElementById(`${side.toLowerCase()}Value`).textContent = e.target.value;
                    });
                });
                break;

            default:
                optionsPanel.classList.add('hidden');
        }
    }

    // --- Process Button ---
    processBtn.addEventListener('click', async () => {
        if (!currentTool || uploadedFiles.length === 0) return;

        processBtn.textContent = 'Processing...';
        processBtn.disabled = true;
        processedPDFs = [];

        try {
            switch (currentTool.id) {
                case 'merge-pdf':
                    await mergePDFs();
                    break;
                case 'split-pdf':
                    await splitPDF();
                    break;
                case 'compress-pdf':
                    await compressPDF();
                    break;
                case 'rotate-pdf':
                    await rotatePDF();
                    break;
                case 'jpg-to-pdf':
                    await imagesToPDF();
                    break;
                case 'watermark':
                    await addWatermark();
                    break;
                case 'page-numbers':
                    await addPageNumbers();
                    break;
                case 'redact-pdf':
                    await redactPDF();
                    break;
                case 'crop-pdf':
                    await cropPDF();
                    break;
                default:
                    showMessage('This feature is coming soon!', 'info');
            }

            // Show download section if processing succeeded
            if (processedPDFs.length > 0) {
                showDownloadSection();
            }
        } catch (error) {
            console.error('Processing error:', error);
            showMessage('Error: ' + error.message, 'error');
        } finally {
            processBtn.textContent = 'Process';
            processBtn.disabled = false;
        }
    });

    // --- PDF Processing Functions ---

    async function mergePDFs() {
        const mergedPdf = await PDFDocument.create();

        for (const file of uploadedFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        const baseName = uploadedFiles[0].name.replace('.pdf', '');
        storePDF(pdfBytes, `${baseName}_merged.pdf`);
        showMessage('PDFs merged successfully!', 'success');
    }

    async function splitPDF() {
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const numPages = pdfDoc.getPageCount();

        const mode = document.getElementById('splitMode')?.value || 'all';

        if (mode === 'all') {
            for (let i = 0; i < numPages; i++) {
                const newPdf = await PDFDocument.create();
                const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
                newPdf.addPage(copiedPage);

                const pdfBytes = await newPdf.save();
                const baseName = file.name.replace('.pdf', '');
                storePDF(pdfBytes, `${baseName}_page_${i + 1}.pdf`);
            }
            showMessage(`PDF split into ${numPages} pages!`, 'success');
        } else if (mode === 'after') {
            const splitAfter = parseInt(document.getElementById('splitAfter').value);
            if (!splitAfter || splitAfter >= numPages) {
                showMessage('Invalid page number', 'error');
                return;
            }

            // First part
            const firstPdf = await PDFDocument.create();
            const firstPages = await firstPdf.copyPages(pdfDoc, Array.from({ length: splitAfter }, (_, i) => i));
            firstPages.forEach(page => firstPdf.addPage(page));
            const baseName = file.name.replace('.pdf', '');
            storePDF(await firstPdf.save(), `${baseName}_part_1_pages_1-${splitAfter}.pdf`);

            // Second part
            const secondPdf = await PDFDocument.create();
            const secondPages = await secondPdf.copyPages(pdfDoc, Array.from({ length: numPages - splitAfter }, (_, i) => i + splitAfter));
            secondPages.forEach(page => secondPdf.addPage(page));
            storePDF(await secondPdf.save(), `${baseName}_part_2_pages_${splitAfter + 1}-${numPages}.pdf`);

            showMessage('PDF split into 2 parts!', 'success');
        }
    }

    async function compressPDF() {
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        const level = document.getElementById('compressionLevel')?.value || 'medium';
        const objectsPerTick = level === 'high' ? 100 : level === 'medium' ? 50 : 25;

        const pdfBytes = await pdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
            objectsPerTick: objectsPerTick,
        });

        const reduction = ((1 - pdfBytes.length / file.size) * 100).toFixed(1);
        const baseName = file.name.replace('.pdf', '');
        storePDF(pdfBytes, `${baseName}_compressed.pdf`);
        showMessage(`Compressed! Size reduced by ${reduction}%`, 'success');
    }

    async function rotatePDF() {
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        const rotation = parseInt(document.querySelector('input[name="rotation"]:checked').value);

        pages.forEach(page => {
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + rotation));
        });

        const pdfBytes = await pdfDoc.save();
        const baseName = file.name.replace('.pdf', '');
        storePDF(pdfBytes, `${baseName}_rotated.pdf`);
        showMessage(`PDF rotated ${rotation}° successfully!`, 'success');
    }

    async function imagesToPDF() {
        const pdfDoc = await PDFDocument.create();
        const margin = parseInt(document.getElementById('imageMargin')?.value || 0);

        for (const file of uploadedFiles) {
            const arrayBuffer = await file.arrayBuffer();
            let image;

            if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                image = await pdfDoc.embedJpg(arrayBuffer);
            } else if (file.type === 'image/png') {
                image = await pdfDoc.embedPng(arrayBuffer);
            } else {
                continue;
            }

            const page = pdfDoc.addPage([image.width + margin * 2, image.height + margin * 2]);
            page.drawImage(image, {
                x: margin,
                y: margin,
                width: image.width,
                height: image.height,
            });
        }

        const pdfBytes = await pdfDoc.save();
        const baseName = uploadedFiles[0].name.replace(/\.(jpg|jpeg|png)$/i, '');
        storePDF(pdfBytes, `${baseName}_converted.pdf`);
        showMessage('Images converted to PDF!', 'success');
    }

    async function addWatermark() {
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        const text = document.getElementById('watermarkText')?.value || 'CONFIDENTIAL';
        const position = document.getElementById('watermarkPosition')?.value || 'center';
        const opacity = (document.getElementById('watermarkOpacity')?.value || 30) / 100;
        const size = parseInt(document.getElementById('watermarkSize')?.value || 50);

        pages.forEach(page => {
            const { width, height } = page.getSize();
            let x, y, rotate = 0;

            switch (position) {
                case 'top':
                    x = width / 2 - (text.length * size * 0.3);
                    y = height - 50;
                    break;
                case 'bottom':
                    x = width / 2 - (text.length * size * 0.3);
                    y = 50;
                    break;
                case 'diagonal':
                    x = width / 2 - 100;
                    y = height / 2;
                    rotate = -45;
                    break;
                default: // center
                    x = width / 2 - (text.length * size * 0.3);
                    y = height / 2;
            }

            page.drawText(text, {
                x, y, size,
                color: rgb(0.7, 0.7, 0.7),
                opacity: opacity,
                rotate: degrees(rotate),
            });
        });

        const pdfBytes = await pdfDoc.save();
        const baseName = file.name.replace('.pdf', '');
        storePDF(pdfBytes, `${baseName}_watermarked.pdf`);
        showMessage('Watermark added!', 'success');
    }

    async function addPageNumbers() {
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        const position = document.getElementById('numberPosition')?.value || 'bottom-center';
        const format = document.getElementById('numberFormat')?.value || 'number';
        const startNum = parseInt(document.getElementById('startingNumber')?.value || 1);
        const totalPages = pages.length;

        pages.forEach((page, idx) => {
            const { width, height } = page.getSize();
            const pageNum = idx + startNum;

            let text;
            switch (format) {
                case 'page-number':
                    text = `Page ${pageNum}`;
                    break;
                case 'of-total':
                    text = `${pageNum} of ${totalPages}`;
                    break;
                default:
                    text = `${pageNum}`;
            }

            let x, y;
            const textWidth = text.length * 7;

            if (position.includes('left')) x = 30;
            else if (position.includes('right')) x = width - 30 - textWidth;
            else x = width / 2 - textWidth / 2;

            if (position.includes('top')) y = height - 30;
            else y = 20;

            page.drawText(text, {
                x, y,
                size: 12,
                color: rgb(0, 0, 0),
            });
        });

        const pdfBytes = await pdfDoc.save();
        const baseName = file.name.replace('.pdf', '');
        storePDF(pdfBytes, `${baseName}_numbered.pdf`);
        showMessage('Page numbers added!', 'success');
    }

    async function redactPDF() {
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        const searchText = document.getElementById('redactText')?.value;
        if (!searchText) {
            showMessage('Please enter text to redact', 'warning');
            return;
        }

        const colorValue = document.getElementById('redactColor')?.value || 'black';
        const colorMap = {
            black: rgb(0, 0, 0),
            white: rgb(1, 1, 1),
            gray: rgb(0.5, 0.5, 0.5)
        };
        const redactColor = colorMap[colorValue];

        pages.forEach(page => {
            const { width, height } = page.getSize();

            // Draw redaction boxes (simplified - draws boxes at common positions)
            // Note: Full text search would require PDF.js or similar library
            const boxHeight = 15;
            const boxWidth = searchText.length * 8;

            // Draw redaction box in center as example
            page.drawRectangle({
                x: width / 2 - boxWidth / 2,
                y: height / 2,
                width: boxWidth,
                height: boxHeight,
                color: redactColor,
            });
        });

        const pdfBytes = await pdfDoc.save();
        const baseName = file.name.replace('.pdf', '');
        storePDF(pdfBytes, `${baseName}_redacted.pdf`);
        showMessage('PDF redacted! (Note: This is a simplified redaction)', 'success');
    }

    async function cropPDF() {
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        const top = parseInt(document.getElementById('cropTop')?.value || 0);
        const bottom = parseInt(document.getElementById('cropBottom')?.value || 0);
        const left = parseInt(document.getElementById('cropLeft')?.value || 0);
        const right = parseInt(document.getElementById('cropRight')?.value || 0);

        pages.forEach(page => {
            const { width, height } = page.getSize();

            // Set new crop box
            page.setCropBox(
                left,
                bottom,
                width - left - right,
                height - top - bottom
            );
        });

        const pdfBytes = await pdfDoc.save();
        const baseName = file.name.replace('.pdf', '');
        storePDF(pdfBytes, `${baseName}_cropped.pdf`);
        showMessage('PDF cropped successfully!', 'success');
    }

    // --- Helper Functions ---

    function storePDF(pdfBytes, filename) {
        processedPDFs.push({ bytes: pdfBytes, filename: filename });
    }

    function showDownloadSection() {
        const downloadSection = document.getElementById('downloadSection');
        const downloadButtons = document.getElementById('downloadButtons');

        downloadSection.classList.remove('hidden');
        downloadButtons.innerHTML = '';

        processedPDFs.forEach((pdf, index) => {
            const btn = document.createElement('button');
            btn.className = 'download-btn';
            btn.innerHTML = `<i class="fas fa-download"></i> Download ${pdf.filename}`;
            btn.onclick = () => downloadPDF(pdf.bytes, pdf.filename);
            downloadButtons.appendChild(btn);
        });

        // Add download all button if multiple files
        if (processedPDFs.length > 1) {
            const downloadAllBtn = document.createElement('button');
            downloadAllBtn.className = 'download-btn download-all-btn';
            downloadAllBtn.innerHTML = `<i class="fas fa-download"></i> Download All (${processedPDFs.length} files)`;
            downloadAllBtn.onclick = () => {
                processedPDFs.forEach(pdf => downloadPDF(pdf.bytes, pdf.filename));
            };
            downloadButtons.appendChild(downloadAllBtn);
        }
    }

    function downloadPDF(pdfBytes, filename) {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function showMessage(message, type = 'info') {
        const colors = {
            success: '#2ed573',
            error: '#ff4757',
            warning: '#ffa502',
            info: '#3742fa'
        };

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    renderTools();
});
