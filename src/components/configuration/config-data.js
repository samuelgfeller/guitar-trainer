export const availableNotesOnStrings = {
    // String name: [possible keys for string]
    'E': ['E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯'],
    'A': ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯'],
    'D': ['D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C', 'C♯'],
    'G': ['G', 'G♯', 'A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯'],
    'B': ['B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯'],
    'E2': ['E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯'],
};

export const pattern1keyNote = 'G';
export const pattern2keyNote = 'D';

// Themes
export const themes = {
    'dark': {
        'accent-color': {
            'saddlebrown': '138, 68, 18',
            '#005d72': '0, 92, 114',
            'darkslateblue': '72, 61, 140'
        },
        'background-color': '#0e0e0e',
        'secondary-text-color': '#919191',
        'primary-text-color': '#c0c0c0',
        // White or black 255 for dark mode and 0 for light mode for rgba values
        'icon-filter': 'invert(70%)',
        'modal-background-color': 'rgba(3, 10, 0, 0.85)',
    },
    'light': {
        'accent-color': {
            // 'saddlebrown': '138, 68, 18',
            // '#005d72': '0, 92, 114',
            // 'darkslateblue': '72, 61, 140'
        },
        'background-color': 'whitesmoke',
        'secondary-text-color': '#3f3f3f',
        'primary-text-color': '#1e1e1e',
        'icon-filter': 'invert(0)',
        'modal-background-color': 'rgba(255 , 255, 255, .8)',
    },
};