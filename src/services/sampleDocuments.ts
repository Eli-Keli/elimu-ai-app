/**
 * Sample Documents Service
 * 
 * Provides pre-processed sample documents for demo and first-time user experience.
 * Each sample includes:
 * - Simplified content (already processed)
 * - Pre-generated images (bundled in assets)
 * - Quiz questions and flashcards
 * - Key takeaways
 * 
 * Benefits:
 * - Instant loading (no API calls needed)
 * - Works offline
 * - Perfect for onboarding
 * - Zero runtime cost
 */

export interface VisualAid {
    type: 'diagram' | 'infographic' | 'timeline' | 'graph' | 'map';
    title: string;
    description: string;
    imagePath: string;  // Path within the sample folder
    uri?: any;  // require() result for actual image
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;  // Index of correct option
    explanation: string;
}

export interface Flashcard {
    term: string;
    definition: string;
}

export interface SampleContent {
    id: string;
    title: string;
    subject: string;
    gradeLevel: string;
    readingLevel: string;
    originalText: string;
    simplifiedText: string;
    keyTakeaways: string[];
    visualAids: VisualAid[];
    quiz: QuizQuestion[];
    flashcards: Flashcard[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedReadingTime: string;
    processingTimeMs: number;
}

export interface SampleDocument {
    id: string;
    title: string;
    subject: string;
    emoji: string;
    preview: string;
    content: SampleContent;
}

// Import sample content JSON files (CBC Kenya Curriculum)
const biologyCellsContent = require('../../assets/samples/biology_cells/content.json') as SampleContent;
const chemistryAtomsContent = require('../../assets/samples/chemistry_atoms/content.json') as SampleContent;
const mathQuadraticContent = require('../../assets/samples/math_quadratic/content.json') as SampleContent;
const physicsMotionContent = require('../../assets/samples/physics_motion/content.json') as SampleContent;
const historyPrecolonialContent = require('../../assets/samples/history_precolonial_kenya/content.json') as SampleContent;
const kiswahiliContent = require('../../assets/samples/kiswahili_uandishi/content.json') as SampleContent;
const geographyEastAfricaContent = require('../../assets/samples/geography_east_africa/content.json') as SampleContent;

// Import all images statically (React Native doesn't support dynamic require)
const biology_cell_structure = require('../../assets/samples/biology_cells/cell_structure.png');
const biology_cell_comparison = require('../../assets/samples/biology_cells/cell_comparison.png');
const biology_cell_analogy = require('../../assets/samples/biology_cells/cell_analogy.png');

const chemistry_atom_structure = require('../../assets/samples/chemistry_atoms/atom_structure.png');
const chemistry_electron_transfer = require('../../assets/samples/chemistry_atoms/electron_transfer.png');

const math_parabola_graph = require('../../assets/samples/math_quadratic/parabola_graph.png');
const math_factoring_steps = require('../../assets/samples/math_quadratic/factoring_steps.png');
const math_formula_guide = require('../../assets/samples/math_quadratic/formula_guide.png');

const physics_three_laws = require('../../assets/samples/physics_motion/three_laws.png');
const physics_action_reaction = require('../../assets/samples/physics_motion/action_reaction_kenya.png');

const history_community_map = require('../../assets/samples/history_precolonial_kenya/community_map.png');
const history_trade_routes = require('../../assets/samples/history_precolonial_kenya/trade_routes.png');
const history_language_groups = require('../../assets/samples/history_precolonial_kenya/language_groups.png');

const kiswahili_essay_structure = require('../../assets/samples/kiswahili_uandishi/essay_structure.png');
const kiswahili_essay_types = require('../../assets/samples/kiswahili_uandishi/essay_types.png');
const kiswahili_writing_process = require('../../assets/samples/kiswahili_uandishi/writing_process.png');

const geography_features_importance = require('../../assets/samples/geography_east_africa/features_importance.png');
const geography_normal_crust = require('../../assets/samples/geography_east_africa/normal_crust.png');
const geography_faults_form = require('../../assets/samples/geography_east_africa/faults_form.png');

// Map image paths to actual image modules
const IMAGE_MAP: { [key: string]: any } = {
    'biology_cells/cell_structure.png': biology_cell_structure,
    'biology_cells/cell_comparison.png': biology_cell_comparison,
    'biology_cells/cell_analogy.png': biology_cell_analogy,
    'chemistry_atoms/atom_structure.png': chemistry_atom_structure,
    'chemistry_atoms/electron_transfer.png': chemistry_electron_transfer,
    'math_quadratic/parabola_graph.png': math_parabola_graph,
    'math_quadratic/factoring_steps.png': math_factoring_steps,
    'math_quadratic/formula_guide.png': math_formula_guide,
    'physics_motion/three_laws.png': physics_three_laws,
    'physics_motion/action_reaction_kenya.png': physics_action_reaction,
    'history_precolonial_kenya/community_map.png': history_community_map,
    'history_precolonial_kenya/trade_routes.png': history_trade_routes,
    'history_precolonial_kenya/language_groups.png': history_language_groups,
    'kiswahili_uandishi/essay_structure.png': kiswahili_essay_structure,
    'kiswahili_uandishi/essay_types.png': kiswahili_essay_types,
    'kiswahili_uandishi/writing_process.png': kiswahili_writing_process,
    'geography_east_africa/features_importance.png': geography_features_importance,
    'geography_east_africa/normal_crust.png': geography_normal_crust,
    'geography_east_africa/faults_form.png': geography_faults_form,
};

/**
 * Sample Documents Library
 * 
 * All 7 samples are CBC Kenya Curriculum aligned with images generated via Google Imagen (Nano Banana Pro).
 * 
 * Junior Secondary: Biology (G7), History (G8), Geography (G8), Kiswahili (G9)
 * Senior Secondary: Chemistry (G10), Physics (G10), Math (G11)
 */
export const SAMPLE_DOCUMENTS: SampleDocument[] = [
    // Junior Secondary
    {
        id: 'biology_cells',
        title: 'Cell Structure and Functions',
        subject: 'Integrated Science',
        emoji: '🧬',
        preview: 'Grade 7: Learn about plant and animal cells with Kenyan examples (Mahindi, Sukuma Wiki). CBC aligned.',
        content: {
            ...biologyCellsContent,
            visualAids: biologyCellsContent.visualAids.map(aid => ({
                ...aid,
                uri: IMAGE_MAP[`biology_cells/${aid.imagePath}`],
            }))
        }
    },
    {
        id: 'history_precolonial_kenya',
        title: 'Pre-Colonial Kenya',
        subject: 'Social Studies',
        emoji: '🇰🇪',
        preview: 'Grade 8: Explore Bantu, Nilotes, and Cushites communities, Kamba trade routes, and pre-colonial organization.',
        content: {
            ...historyPrecolonialContent,
            visualAids: historyPrecolonialContent.visualAids.map(aid => ({
                ...aid,
                uri: IMAGE_MAP[`history_precolonial_kenya/${aid.imagePath}`],
            }))
        }
    },
    {
        id: 'geography_east_africa',
        title: 'Physical Geography of East Africa',
        subject: 'Geography',
        emoji: '🏔️',
        preview: 'Grade 8: Discover the Rift Valley, Mt. Kenya, Lake Victoria, and coastal features with formation processes.',
        content: {
            ...geographyEastAfricaContent,
            visualAids: geographyEastAfricaContent.visualAids.map(aid => ({
                ...aid,
                uri: IMAGE_MAP[`geography_east_africa/${aid.imagePath}`],
            }))
        }
    },
    {
        id: 'kiswahili_uandishi',
        title: 'Uandishi wa Insha',
        subject: 'Kiswahili',
        emoji: '📝',
        preview: 'Grade 9: Master essay writing in Kiswahili - Insha ya Hisia, Habari, Maelezo, na Jadili.',
        content: {
            ...kiswahiliContent,
            visualAids: kiswahiliContent.visualAids.map(aid => ({
                ...aid,
                uri: IMAGE_MAP[`kiswahili_uandishi/${aid.imagePath}`],
            }))
        }
    },
    
    // Senior Secondary
    {
        id: 'chemistry_atoms',
        title: 'Atomic Structure',
        subject: 'Chemistry',
        emoji: '⚛️',
        preview: 'Grade 10: Understand atoms, protons, electrons with Kenyan examples (NaCl salt, NPK fertilizers, copper wires).',
        content: {
            ...chemistryAtomsContent,
            visualAids: chemistryAtomsContent.visualAids.map(aid => ({
                ...aid,
                uri: IMAGE_MAP[`chemistry_atoms/${aid.imagePath}`],
            }))
        }
    },
    {
        id: 'physics_motion',
        title: "Newton's Laws of Motion",
        subject: 'Physics',
        emoji: '⚡',
        preview: "Grade 10: Master Newton's three laws with matatu, boda boda, and Lake Victoria examples. Includes F=ma calculations.",
        content: {
            ...physicsMotionContent,
            visualAids: physicsMotionContent.visualAids.map(aid => ({
                ...aid,
                uri: IMAGE_MAP[`physics_motion/${aid.imagePath}`],
            }))
        }
    },
    {
        id: 'math_quadratic',
        title: 'Quadratic Equations',
        subject: 'Mathematics',
        emoji: '📐',
        preview: 'Grade 11: Solve quadratic equations with factoring and formula. Real-world applications: matatu business, farming.',
        content: {
            ...mathQuadraticContent,
            visualAids: mathQuadraticContent.visualAids.map(aid => ({
                ...aid,
                uri: IMAGE_MAP[`math_quadratic/${aid.imagePath}`],
            }))
        }
    }
];

/**
 * Get a sample document by ID
 */
export function getSampleDocument(id: string): SampleDocument | undefined {
    return SAMPLE_DOCUMENTS.find(doc => doc.id === id);
}

/**
 * Get all sample documents
 */
export function getAllSampleDocuments(): SampleDocument[] {
    return SAMPLE_DOCUMENTS;
}

/**
 * Get samples by subject
 */
export function getSamplesBySubject(subject: string): SampleDocument[] {
    return SAMPLE_DOCUMENTS.filter(doc =>
        doc.subject.toLowerCase() === subject.toLowerCase()
    );
}

/**
 * Convert sample document to DocumentProcessingResult format
 * (Compatible with existing processDocument result)
 */
export function sampleToProcessingResult(sample: SampleDocument) {
    return {
        text: sample.content.simplifiedText,
        audio: {
            audioUri: null,  // Will be generated by TTS on-demand
            status: 'ready' as const,
        },
        images: {
            images: sample.content.visualAids,
            status: 'ready' as const,
        },
        metadata: {
            originalLength: sample.content.originalText.length,
            simplifiedLength: sample.content.simplifiedText.length,
            processingTimeMs: sample.content.processingTimeMs,
            readingLevel: sample.content.readingLevel,
        },
        // Additional sample-specific data
        keyTakeaways: sample.content.keyTakeaways,
        quiz: sample.content.quiz,
        flashcards: sample.content.flashcards,
    };
}

/**
 * Image generation prompts for reference
 * All images generated with Google Imagen (Nano Banana Pro) via Gemini chat
 * https://gemini.google.com/
 */
export const IMAGE_GENERATION_PROMPTS = {
    biology_cells: {
        cell_structure: "Side-by-side diagram showing plant cell and animal cell. Plant cell (left) with cell wall, chloroplast (green), large vacuole. Animal cell (right) without cell wall, smaller vacuoles. Both with nucleus, mitochondria (purple), cell membrane labeled. Cartoon educational style, colorful, clean white background. Target: Grade 7 Kenyan students.",
        school_analogy: "Educational infographic comparing cell parts to school building. School building outline with labeled sections: Principal's office = Nucleus (control center), KPLC generator = Mitochondria (energy), Classrooms = Ribosomes (protein factories), School compound fence = Cell membrane (boundary). Cartoon style, colorful icons, simple for Kenyan Grade 7 students.",
        kenyan_plants: "Three plants commonly found in Kenya drawn in simple cartoon style. Left: Maize/Mahindi plant with yellow corn, middle: Kale/Sukuma Wiki with green leaves, right: Beans/Maharagwe plant with pods. Each labeled in English and Kiswahili. Plant cells visible under microscope insert. Educational poster style, colorful, white background. Target: Kenyan Grade 7 students."
    },
    chemistry_atoms: {
        atom_structure: "Labeled diagram of atom showing nucleus at center with protons (red spheres marked +) and neutrons (gray spheres). Two electron shells around nucleus with blue electrons (marked -) orbiting. Clear labels: 'Nucleus/Kiini', 'Protons/Protoni', 'Neutrons/Nyutroni', 'Electrons/Elektroni', 'Electron Shells'. Bilingual English/Kiswahili. Clean educational chemistry style, colorful, white background. Target: Grade 10 Kenyan students.",
        sodium_chloride: "Step-by-step diagram showing sodium and chlorine atoms forming salt (NaCl). Left: Sodium atom (Na) with 1 outer electron. Middle: Chlorine atom (Cl) with 7 outer electrons. Right: Resulting Na+ and Cl- ions attracted (indicated by + and - and arrows). Crystal lattice structure shown below. Labels in English and Kiswahili: 'Chumvi/Salt', 'Ioni/Ions'. Educational chemistry style, colorful, white background. Target: Grade 10 Kenyan students."
    },
    math_quadratic: {
        parabola_graph: "Graph of quadratic function (parabola) on coordinate grid. Parabola opens upward, vertex at bottom marked clearly, x-intercepts/roots marked with dots on x-axis, y-intercept marked on y-axis. Axis of symmetry shown as dashed vertical line. Labels: 'Vertex', 'Roots', 'Axis of Symmetry', 'Parabola'. Clean math style, blue curve on white grid, educational. Target: Grade 11 Kenyan students.",
        factoring_diagram: "Step-by-step visual breakdown of factoring quadratic equation. Top: x² + 5x + 6 in box. Middle: Two numbers that multiply to 6 and add to 5 shown with thought bubble (2 and 3). Bottom: Final factored form (x+2)(x+3) in two connected boxes. Arrows connecting each step. Colorful boxes (blue, green, orange), simple educational math style. Target: Grade 11 Kenyan students.",
        formula_breakdown: "Quadratic formula infographic. Large formula at top: x = (-b ± √(b²-4ac)) / 2a. Below, color-coded breakdown showing each part: 'a' (red box) = coefficient of x², 'b' (blue box) = coefficient of x, 'c' (green box) = constant. Example with numbers: a=1, b=5, c=6 plugged into formula. Step-by-step calculation shown. Educational poster style, colorful, clean layout. Target: Grade 11 Kenyan students."
    },
    physics_motion: {
        newtons_laws: "Three panel educational diagram. Panel 1 (left): Matatu moving at constant speed showing Law 1 (Inertia). Panel 2 (middle): Person pushing matatu with force arrow showing F=ma (Law 2). Panel 3 (right): Person jumping from matatu showing action-reaction forces (Law 3). Each panel labeled with law number and Kiswahili/English terms: 'Utulivu/Inertia', 'Nguvu/Force', 'Kitendo na Mwitikio/Action-Reaction'. Cartoon style, colorful, educational. Target: Grade 10 Kenyan students.",
        action_reaction: "Four examples of action-reaction pairs in 2x2 grid. Top-left: Swimmer pushing water backward (action) and water pushing swimmer forward (reaction). Top-right: Person walking - foot pushing ground backward (action), ground pushing person forward (reaction). Bottom-left: Boda boda tire pushing road (action), road pushing tire forward (reaction). Bottom-right: Rowing boat on Lake Victoria - paddle pushing water (action), water pushing boat (reaction). Each with labeled arrows showing force pairs. Cartoon educational style, colorful. Target: Grade 10 Kenyan students."
    },
    history_precolonial_kenya: {
        communities_map: "Simplified map of Kenya showing distribution of three main pre-colonial language groups. Color-coded regions: Blue for Bantu communities (central and western - Kikuyu, Kamba, Luhya areas), Green for Nilotes (western and Rift Valley - Maasai, Luo, Kalenjin areas), Yellow for Cushites (northern and eastern - Somali, Oromo areas). Major community names labeled on map. Legend showing three groups with colors. Educational atlas style, clean, simple for Grade 8 Kenyan students.",
        trade_routes: "Historical map showing Kamba trade routes from interior to coast. Map of Kenya with Ukambani (central) highlighted and dotted lines showing trade paths to Mombasa on coast. Icons showing traded goods: Ivory (elephant tusks), Copper, Iron tools, Beads, Salt. Small caravans drawn along routes. Labels in English and Kiswahili: 'Biashara/Trade', 'Njia za Biashara/Trade Routes', 'Ukambani', 'Mombasa'. Educational historical style, earth tones, simple illustration. Target: Grade 8 Kenyan students.",
        groups_comparison: "Three-column comparison chart of Bantu, Nilotes, and Cushites. Each column has icon of people, then rows comparing: Language family, Economic activities (farming/pastoralism/trade icons), Examples of communities (Kikuyu, Kamba, Luhya vs Maasai, Luo, Kalenjin vs Somali, Oromo), Settlement patterns (permanent villages vs nomadic). Color-coded columns (blue, green, yellow). Educational infographic style, simple icons, clean layout. Target: Grade 8 Kenyan students."
    },
    kiswahili_uandishi: {
        essay_structure: "Pyramid diagram showing essay structure in Kiswahili. Bottom/base (largest): 'Utangulizi' (Introduction) - Swali, Maelezo ya Jumla. Middle: 'Kiini' (Body) - Aya 1, Aya 2, Aya 3, each with 'Wazo Kuu + Ufafanuzi'. Top (smallest): 'Hitimisho' (Conclusion) - Muhtasari, Mwisho Thabiti. Arrows showing flow from bottom to top. Colorful pyramid (orange gradient), clear labels in Kiswahili. Educational style. Target: Grade 9 Kenyan students.",
        essay_types: "Four-quadrant poster showing types of Kiswahili essays. Top-left: 'Insha ya Hisia' (Descriptive) with paintbrush icon. Top-right: 'Insha ya Habari' (Narrative) with book/story icon. Bottom-left: 'Insha ya Maelezo' (Expository) with lightbulb icon. Bottom-right: 'Insha ya Jadili' (Argumentative) with debate/discussion icon. Each quadrant different color (blue, green, orange, red), with brief description and example topic in Kiswahili. Educational poster style, colorful, clean layout. Target: Grade 9 Kenyan students.",
        writing_process: "Circular flowchart showing writing process in Kiswahili. Circle divided into 5 segments with arrows showing clockwise flow: 1. 'Kupanga Mawazo' (Planning ideas) - notepad icon, 2. 'Kuandika Muswada' (First draft) - pencil icon, 3. 'Kusahihisha' (Revising) - eraser icon, 4. 'Kuhariri' (Editing) - red pen icon, 5. 'Kuandika Nakala Safi' (Final copy) - finished document icon. Center text: 'Mchakato wa Uandishi' (Writing Process). Colorful segments, clear Kiswahili labels. Educational style. Target: Grade 9 Kenyan students."
    },
    geography_east_africa: {
        physical_map: "Physical map of East Africa (Kenya, Uganda, Tanzania) with color-coded elevation and features. Mountains shown with brown peaks and labeled with heights: Mt. Kenya 5,199m, Mt. Kilimanjaro 5,895m, Mt. Elgon. Great Rift Valley shown as greenish valley cutting through. Lakes in blue: Lake Victoria (largest), Lake Turkana, Lake Nakuru, Lake Tanganyika. White sandy coast along Indian Ocean in east with Mombasa marked. Legend showing elevation colors and feature symbols. Educational atlas style, clear labels in English and Kiswahili where appropriate. Target: Grade 8 Kenyan students.",
        rift_formation: "Cross-section diagram showing formation of Great Rift Valley (Bonde Kuu la Ufa). Cutaway side view of Earth's crust. Left and right sides show uplifted highlands (labeled 'Uplands/Mwinuko'). Center shows sunken valley floor between two parallel faults (labeled 'Rift Valley Floor/Bonde'). Fault lines marked with zigzag lines. Arrows showing tectonic forces pulling apart. Volcanic cones on valley floor. Layers of rock visible in cross-section. Labels in English and Kiswahili: 'Faulting/Ufa', 'Valley/Bonde', 'Escarpment/Mteremko'. Educational geology style, earth tones (brown, orange, tan). Target: Grade 8 Kenyan students.",
        features_importance: "Infographic showing economic importance of East African physical features. Four sections with icons and text: 1. Mountains (Mt. Kenya image) - 'Tourism, Water Towers, Tea & Coffee Farming' with tourist, water droplet, crop icons. 2. Rift Valley (valley image) - 'Geothermal Energy at Olkaria, Tourism, Farming' with power plant, camera, farm icons. 3. Lakes (Lake Victoria image) - 'Fishing, Transport, Water Supply' with fish, boat, tap icons. 4. Coast (beach image) - 'Mombasa Port, Tourism, Trade' with ship, beach umbrella, cargo icons. Color-coded sections, simple icons, bilingual labels (English/Kiswahili). Educational poster style. Target: Grade 8 Kenyan students."
    }
};
