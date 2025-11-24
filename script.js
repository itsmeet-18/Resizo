document.addEventListener('DOMContentLoaded', () => {
    const { PDFDocument, rgb, degrees } = PDFLib;

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

    let currentTool = null;
    let uploadedFiles = [];

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

        // Update file input accept attribute based on tool
        updateFileInputAccept(tool.id);

        // Reset drop zone
        resetDropZone();

        window.scrollTo(0, 0);
    }

    function goHome() {
        currentTool = null;
        uploadedFiles = [];

        toolView.classList.remove('active');
        toolView.classList.add('hidden');

        homeView.classList.remove('hidden');
        homeView.classList.add('active');
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

        // Allow multiple files for merge
        fileInput.multiple = (toolId === 'merge-pdf' || toolId === 'jpg-to-pdf');
    }

    function resetDropZone() {
        dropZone.querySelector('.drop-text').textContent = 'Drag & Drop files here';
        dropZone.classList.remove('drag-over');
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

    // --- File Upload & Processing ---
    selectFilesBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    async function handleFiles(files) {
        if (!currentTool || files.length === 0) return;

        uploadedFiles = Array.from(files);

        // Show processing indicator
        showProcessing();

        try {
            switch (currentTool.id) {
                case 'merge-pdf':
                    await mergePDFs(uploadedFiles);
                    break;
                case 'split-pdf':
                    await splitPDF(uploadedFiles[0]);
                    break;
                case 'compress-pdf':
                    await compressPDF(uploadedFiles[0]);
                    break;
                case 'rotate-pdf':
                    await rotatePDF(uploadedFiles[0]);
                    break;
                case 'jpg-to-pdf':
                    await imagesToPDF(uploadedFiles);
                    break;
                case 'watermark':
                    await addWatermark(uploadedFiles[0]);
                    break;
                case 'page-numbers':
                    await addPageNumbers(uploadedFiles[0]);
                    break;
                default:
                    showMessage('This feature is coming soon!', 'info');
            }
        } catch (error) {
            console.error('Processing error:', error);
            showMessage('Error processing file: ' + error.message, 'error');
        } finally {
            hideProcessing();
        }
    }

    // --- PDF Processing Functions ---

    async function mergePDFs(files) {
        if (files.length < 2) {
            showMessage('Please select at least 2 PDF files to merge', 'warning');
            return;
        }

        const mergedPdf = await PDFDocument.create();

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        downloadPDF(pdfBytes, 'merged.pdf');
        showMessage('PDFs merged successfully!', 'success');
    }

    async function splitPDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const numPages = pdfDoc.getPageCount();

        for (let i = 0; i < numPages; i++) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
            newPdf.addPage(copiedPage);

            const pdfBytes = await newPdf.save();
            downloadPDF(pdfBytes, `page_${i + 1}.pdf`);
        }

        showMessage(`PDF split into ${numPages} pages!`, 'success');
    }

    async function compressPDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        // Basic compression by re-saving
        const pdfBytes = await pdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
            objectsPerTick: 50,
        });

        const originalSize = file.size;
        const newSize = pdfBytes.length;
        const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

        downloadPDF(pdfBytes, 'compressed.pdf');
        showMessage(`PDF compressed! Size reduced by ${reduction}%`, 'success');
    }

    async function rotatePDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        // Rotate each page 90 degrees clockwise
        pages.forEach(page => {
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + 90));
        });

        const pdfBytes = await pdfDoc.save();
        downloadPDF(pdfBytes, 'rotated.pdf');
        showMessage('PDF rotated successfully!', 'success');
    }

    async function imagesToPDF(files) {
        const pdfDoc = await PDFDocument.create();

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            let image;

            if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                image = await pdfDoc.embedJpg(arrayBuffer);
            } else if (file.type === 'image/png') {
                image = await pdfDoc.embedPng(arrayBuffer);
            } else {
                continue;
            }

            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
            });
        }

        const pdfBytes = await pdfDoc.save();
        downloadPDF(pdfBytes, 'images.pdf');
        showMessage('Images converted to PDF successfully!', 'success');
    }

    async function addWatermark(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        const watermarkText = prompt('Enter watermark text:', 'CONFIDENTIAL');
        if (!watermarkText) return;

        pages.forEach(page => {
            const { width, height } = page.getSize();
            page.drawText(watermarkText, {
                x: width / 2 - 100,
                y: height / 2,
                size: 50,
                color: rgb(0.7, 0.7, 0.7),
                opacity: 0.3,
                rotate: degrees(-45),
            });
        });

        const pdfBytes = await pdfDoc.save();
        downloadPDF(pdfBytes, 'watermarked.pdf');
        showMessage('Watermark added successfully!', 'success');
    }

    async function addPageNumbers(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();

        pages.forEach((page, idx) => {
            const { width, height } = page.getSize();
            page.drawText(`${idx + 1}`, {
                x: width / 2 - 10,
                y: 20,
                size: 12,
                color: rgb(0, 0, 0),
            });
        });

        const pdfBytes = await pdfDoc.save();
        downloadPDF(pdfBytes, 'numbered.pdf');
        showMessage('Page numbers added successfully!', 'success');
    }

    // --- Helper Functions ---

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

    function showProcessing() {
        selectFilesBtn.textContent = 'Processing...';
        selectFilesBtn.disabled = true;
        dropZone.style.pointerEvents = 'none';
        dropZone.style.opacity = '0.6';
    }

    function hideProcessing() {
        selectFilesBtn.textContent = 'Select PDF files';
        selectFilesBtn.disabled = false;
        dropZone.style.pointerEvents = 'auto';
        dropZone.style.opacity = '1';
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

    // Add animations to CSS dynamically
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

    // Initialize
    renderTools();
});
