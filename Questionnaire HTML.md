<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Question Management</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc; /* slate-50 */
        }
        .question-card {
            transition: all 0.2s ease-in-out;
        }
        .question-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        .tag {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.625rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        .progress-bar {
            background-color: #e2e8f0; /* slate-200 */
            border-radius: 9999px;
            overflow: hidden;
        }
        .progress {
            height: 100%;
            border-radius: 9999px;
            transition: width 0.3s ease-in-out;
        }
    </style>
</head>
<body class="p-4 sm:p-6 md:p-8">

    <div class="max-w-7xl mx-auto" id="app">
        <!-- Header Section -->
        <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <h1 class="text-3xl font-bold text-slate-800">Questionnaire</h1>
                <p class="text-slate-500 mt-1">Manage and organize all questions for this assessment.</p>
            </div>
            <button class="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition">
                <i data-lucide="plus-circle" class="w-5 h-5"></i>
                <span>Add New Question</span>
            </button>
        </header>

        <!-- Questions List Section -->
        <div class="space-y-4" id="questions-list">
            <!-- Dynamic Question Cards will be inserted here -->
        </div>
    </div>

    <script>
        const questionsData = [
            {
                id: 1,
                questionText: "Which of the following are valid Python data types?",
                questionType: "Standard",
                responseType: "Multiple Correct",
                options: [
                    { text: "List", responses: 45 },
                    { text: "Dictionary", responses: 42 },
                    { text: "Tuple", responses: 38 },
                    { text: "Class", responses: 15 }
                ],
            },
             {
                id: 4,
                questionText: "What is the capital of France?",
                questionType: "Standard",
                responseType: "Single Correct",
                options: [
                    { text: "Berlin", responses: 2 },
                    { text: "Madrid", responses: 5 },
                    { text: "Paris", responses: 58 },
                    { text: "Rome", responses: 1 }
                ],
            },
            {
                id: 6,
                questionText: "Select the name you have listened to in Audio",
                questionType: "Flowchart",
                responseType: "Branching Logic",
                options: [],
                responses: 15
            },
            {
                id: 9,
                questionText: "Provide the Video response for this GIF",
                questionType: "Standard",
                responseType: "GIF",
                options: [],
                responses: 7
            },
            {
                id: 3,
                questionText: "Please upload a short video introducing yourself and your relevant experience.",
                questionType: "Standard",
                responseType: "Video",
                options: [],
                responses: 3
            },
            {
                id: 7,
                questionText: "Record a short audio clip explaining your approach to solving complex algorithmic problems.",
                questionType: "Standard",
                responseType: "Audio",
                options: [],
                responses: 8
            },
            {
                id: 10,
                questionText: "What is your current work location?",
                questionType: "Standard",
                responseType: "Single Location",
                options: [],
                responses: 65
            },
            {
                id: 11,
                questionText: "What are your preferred work locations?",
                questionType: "Standard",
                responseType: "Multiple Locations",
                options: [],
                responses: 55
            },
            {
                id: 5,
                questionText: "Welcome to the assessment! The next section will contain technical questions. Click 'Continue' when you are ready.",
                questionType: "Announcement",
                responseType: "None",
                options: [],
                responses: null
            },
            
        ];

        const questionTypeConfig = {
            Standard: { icon: 'help-circle', color: 'bg-blue-100 text-blue-800' },
            Knockout: { icon: 'x-octagon', color: 'bg-red-100 text-red-800' },
            Announcement: { icon: 'megaphone', color: 'bg-yellow-100 text-yellow-800' },
            Flowchart: { icon: 'git-branch', color: 'bg-purple-100 text-purple-800' },
        };

        const responseTypeConfig = {
            'Multiple Correct': { icon: 'list-checks', color: 'bg-gray-100 text-gray-800' },
            'Single Correct': { icon: 'check-circle-2', color: 'bg-gray-100 text-gray-800' },
            Text: { icon: 'pilcrow', color: 'bg-gray-100 text-gray-800' },
            Video: { icon: 'video', color: 'bg-rose-100 text-rose-800' },
            Audio: { icon: 'mic', color: 'bg-cyan-100 text-cyan-800' },
            Document: { icon: 'file-text', color: 'bg-gray-100 text-gray-800' },
            'Branching Logic': { icon: 'move-right', color: 'bg-gray-100 text-gray-800' },
            GIF: { icon: 'film', color: 'bg-teal-100 text-teal-800' },
            'Single Location': { icon: 'map-pin', color: 'bg-orange-100 text-orange-800' },
            'Multiple Locations': { icon: 'map-pins', color: 'bg-orange-100 text-orange-800' },
            None: { icon: 'minus-circle', color: 'bg-gray-100 text-gray-800' },
        };

        const questionsList = document.getElementById('questions-list');

        function renderQuestions() {
            questionsList.innerHTML = '';

            questionsData.forEach(q => {
                const qType = questionTypeConfig[q.questionType] || { icon: 'help-circle', color: 'bg-gray-100 text-gray-700' };
                const rType = responseTypeConfig[q.responseType] || { icon: 'alert-circle', color: 'bg-gray-100 text-gray-700' };
                
                let totalResponses = 0;
                if (q.options && q.options.length > 0) {
                     totalResponses = q.options.reduce((sum, opt) => sum + (opt.responses || 0), 0);
                } else {
                    totalResponses = q.responses;
                }

                const optionsHtml = q.options && q.options.length > 0 ? `
                    <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        ${q.options.map(opt => {
                            return `
                                <div class="flex items-center justify-between bg-slate-50 p-2 rounded-md border border-slate-200">
                                    <p class="text-slate-700 text-sm">${opt.text}</p>
                                    <span class="text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full px-2.5 py-1">${opt.responses}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : '';

                const flowchartButton = q.questionType === 'Flowchart' ? `
                    <button class="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline mt-4">
                        <span>View All Flowchart Questions</span>
                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
                ` : '';

                const card = `
                    <div class="question-card bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
                        <!-- Icon -->
                        <div class="flex-shrink-0 w-12 h-12 rounded-lg ${qType.color} flex items-center justify-center">
                            <i data-lucide="${qType.icon}" class="w-6 h-6"></i>
                        </div>

                        <!-- Content -->
                        <div class="flex-grow">
                            <p class="text-slate-800 font-medium">${q.questionText}</p>
                            
                            ${optionsHtml}
                            ${flowchartButton}

                            <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                                <div class="tag ${qType.color}">
                                    <i data-lucide="${qType.icon}" class="w-3.5 h-3.5 mr-1.5"></i>
                                    ${q.questionType}
                                </div>
                                <div class="tag ${rType.color}">
                                    <i data-lucide="${rType.icon}" class="w-3.5 h-3.5 mr-1.5"></i>
                                    ${q.responseType}
                                </div>

                                ${q.responses !== null ? `
                                <a href="#" class="text-sm font-medium text-indigo-600 hover:underline">
                                    (${totalResponses} Total Responses)
                                </a>` : ''}
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex-shrink-0 flex items-center gap-2 mt-4 sm:mt-0 ml-auto sm:ml-0">
                            <button class="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-md transition" title="Edit">
                                <i data-lucide="edit-3" class="w-5 h-5"></i>
                            </button>
                            <button class="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-md transition" title="Duplicate">
                                <i data-lucide="copy" class="w-5 h-5"></i>
                            </button>
                            <button class="p-2 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-md transition" title="Delete">
                                <i data-lucide="trash-2" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>
                `;
                questionsList.innerHTML += card;
            });
            lucide.createIcons();
        }

        document.addEventListener('DOMContentLoaded', () => {
            renderQuestions();
        });
        
        lucide.createIcons();
    </script>
</body>
</html>