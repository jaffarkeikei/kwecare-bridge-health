# KweCare Localization Guide

This document provides comprehensive information about KweCare's localization system, which supports multiple Indigenous languages alongside English. It serves as a guide for developers, translators, and content creators working on the application.

## Supported Languages

KweCare currently supports the following languages:

| Language | Code | Type | Direction | Supported Dialects |
|----------|------|------|-----------|-------------------|
| English | `en-CA` | Latin | LTR | Canadian English |
| Plains Cree | `cr-latn` | Latin | LTR | Standard Plains Cree |
| Plains Cree (Syllabics) | `cr-cans` | Syllabic | LTR | Standard Plains Cree |
| Woods Cree | `cr-w` | Latin/Syllabic | LTR | Standard Woods Cree |
| Swampy Cree | `cr-s` | Latin/Syllabic | LTR | Standard Swampy Cree |
| Inuktitut | `iu` | Syllabic | LTR | Multiple regional variants |
| Inuktitut (Latin) | `iu-latn` | Latin | LTR | Standardized transliteration |
| Ojibwe | `oj` | Latin | LTR | Southern, Northwestern |
| Michif | `crg` | Latin | LTR | Standard Michif |
| Denesuline | `chp` | Latin | LTR | Standard Denesuline |

## Localization Architecture

```mermaid
graph TD
    subgraph "Localization System"
        I18N[i18next Framework] --> Config[Configuration]
        I18N --> Resources[Translation Resources]
        I18N --> Plugins[Plugins]
        
        Config --> Detection[Language Detection]
        Config --> Fallbacks[Fallback Chain]
        Config --> Format[Formatting Rules]
        
        Resources --> Namespaces[Namespaces]
        Resources --> Languages[Language Files]
        
        Plugins --> Backend[Backend Plugin]
        Plugins --> Formatter[Format Plugin]
        Plugins --> PostProcessor[Post Processor]
    end
```

### Technical Implementation

KweCare uses the i18next framework for localization with the following setup:

1. **Core Localization System**
   - i18next for translation management
   - React-i18next for React integration
   - Locale-specific formatting for dates, numbers, and units

2. **Language Detection Strategy**
   - User preference stored in localStorage/IndexedDB
   - Browser language detection as fallback
   - Geolocation-based suggestion for first-time users
   - QR code based community preset option

3. **Translation File Structure**
   - JSON-based translation files
   - Namespace separation for modular loading
   - Context-sensitive translations
   - Pluralization support

## Translation Workflow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Platform as Translation Platform
    participant Translator
    participant Reviewer
    participant App
    
    Dev->>Platform: Upload source strings
    Platform->>Translator: Assign translation tasks
    Translator->>Platform: Submit translations
    Platform->>Reviewer: Assign review tasks
    Reviewer->>Platform: Approve/modify translations
    Platform->>Dev: Export approved translations
    Dev->>App: Integrate translation files
    App->>App: Build with new translations
```

### Translation Process

1. **Source String Extraction**
   - Automated extraction from code via i18next parser
   - Manual review of extracted strings for context
   - Addition of translator notes for complex concepts

2. **Translation Management**
   - Collaborative translation platform (Localazy)
   - Version control for translations
   - Context screenshots for UI elements
   - Medical terminology glossary

3. **Quality Assurance**
   - Community translator review
   - Elder validation for cultural appropriateness
   - Technical validation (variable substitution, formatting)
   - Clinical validation for medical terminology

## Special Considerations for Indigenous Languages

### 1. Syllabic Writing Systems

```mermaid
graph TD
    subgraph "Syllabics Support"
        Syllabics[Syllabics Support] --> Fonts[Font Selection]
        Syllabics --> Rendering[Text Rendering]
        Syllabics --> Input[Input Methods]
        
        Fonts --> Embed[Embedded Fonts]
        Fonts --> Fallback[Fallback Chain]
        
        Rendering --> Shaping[Text Shaping]
        Rendering --> Size[Font Sizing]
        
        Input --> Virtual[Virtual Keyboard]
        Input --> Transliteration[Latin Transliteration]
    end
```

KweCare implements the following for syllabic scripts:

- **Font Implementation**
  - Custom font embedding for consistent rendering
  - Aboriginal Sans as primary syllabic font
  - Appropriate font fallback chains
  - Optimized for mobile display

- **Text Input Methods**
  - Virtual syllabic keyboard
  - Latin-to-syllabic conversion
  - Voice input with syllabic output
  - Predictive text in syllabics

### 2. Dialectal Variations

```mermaid
graph TD
    subgraph "Dialect Handling"
        Dialect[Dialect System] --> Detection[Dialect Detection]
        Dialect --> Switching[Dialect Switching]
        Dialect --> Content[Content Adaptation]
        
        Detection --> User[User Selection]
        Detection --> Community[Community Default]
        
        Switching --> Runtime[Runtime Switching]
        Switching --> Persistence[User Preference]
        
        Content --> Terms[Terminology]
        Content --> Expressions[Expressions]
        Content --> Audio[Audio Content]
    end
```

KweCare's approach to dialectal variations:

- **Dialect Configuration**
  - Primary dialect selection per language
  - Region-specific terminology options
  - Community defaults for deployment settings

- **Content Adaptation**
  - Key health terminology in all major dialects
  - Audio recordings in specific dialects
  - Labeled dialectal alternatives when relevant

### 3. Cultural Context in Translation

```mermaid
graph TD
    subgraph "Cultural Context"
        Context[Cultural Context] --> Concept[Concept Mapping]
        Context --> Ceremony[Ceremonial References]
        Context --> Season[Seasonal Context]
        Context --> Relationship[Relationship Terms]
        
        Concept --> Western[Western Medical Concepts]
        Concept --> Traditional[Traditional Concepts]
        
        Ceremony --> Protocol[Protocol Awareness]
        Ceremony --> Timing[Timing Sensitivity]
        
        Season --> Calendar[Indigenous Calendar]
        Season --> Activity[Seasonal Activities]
        
        Relationship --> Kinship[Kinship Terms]
        Relationship --> Community[Community Roles]
    end
```

The translation process includes:

- **Conceptual Bridge Translation**
  - Western medical concepts explained in culturally relevant terms
  - Traditional health concepts accurately represented
  - Avoidance of direct translation for incompatible concepts

- **Contextual Awareness**
  - Seasonal references appropriate to northern communities
  - Ceremonial and protocol-sensitive terminology
  - Kinship and relationship terminology preservation

## String Management Guidelines

### 1. String Format

```
{
  "key": "Value with {{variable}}",
  "key_plural": "Value with {{count}} items",
  "key_context": "Contextual variation"
}
```

### 2. Placeholders and Variables

| Type | Format | Example | Usage |
|------|--------|---------|-------|
| Simple | `{{variable}}` | `Hello {{name}}` | Basic substitution |
| Counted | `{{count}}` | `{{count}} appointments` | Used with plurals |
| Formatted | `{{variable, format}}` | `{{date, YYYY-MM-DD}}` | With formatting |
| Nested | `$t(key)` | `$t(common.greeting)` | Translation reference |

### 3. Pluralization

KweCare supports complex pluralization rules for languages that require them:

```json
{
  "appointment": "{{count}} appointment",
  "appointment_plural": "{{count}} appointments",
  "appointment_0": "No appointments",
  "appointment_1": "One appointment",
  "appointment_many": "Many appointments"
}
```

Indigenous language pluralization often follows different rules than English, and these are implemented as language-specific pluralization functions.

## UI Adaptation for Language

```mermaid
graph TD
    subgraph "UI Adaptation"
        UI[UI Adaptation] --> TextLength[Text Length]
        UI --> Direction[Direction]
        UI --> Font[Font Requirements]
        UI --> Voice[Voice Interface]
        
        TextLength --> Expansion[Text Expansion]
        TextLength --> Truncation[Graceful Truncation]
        
        Direction --> RTL[RTL Support]
        Direction --> Bidirectional[Bidirectional Text]
        
        Font --> Size[Font Sizing]
        Font --> Syllabic[Syllabic Requirements]
        
        Voice --> Recognition[Recognition Adaptation]
        Voice --> TTS[Text-to-Speech]
    end
```

### UI Considerations

1. **Text Length Management**
   - Indigenous languages often require more space than English
   - Flexible layouts to accommodate text expansion
   - Truncation with ellipsis and tooltips when necessary
   - Scrollable areas for longer content

2. **Typography Considerations**
   - Larger font sizes for syllabics (minimum 16px)
   - Higher line height for diacritics
   - Proper font fallbacks for unsupported characters
   - Consistent font weight across writing systems

3. **Voice Interface Adaptations**
   - Language-specific wake words and commands
   - Dialect-specific recognition models
   - Appropriate response pacing and intonation
   - Cultural protocol in voice interaction

## Medical Terminology Translation

KweCare maintains a comprehensive medical terminology database across all supported languages:

```mermaid
graph TD
    subgraph "Medical Terminology"
        Term[Terminology System] --> Western[Western Medicine]
        Term --> Traditional[Traditional Medicine]
        Term --> Mapping[Concept Mapping]
        
        Western --> Conditions[Health Conditions]
        Western --> Treatments[Treatments]
        Western --> Anatomy[Anatomy]
        
        Traditional --> Plants[Plant Medicine]
        Traditional --> Practices[Traditional Practices]
        Traditional --> Approaches[Healing Approaches]
        
        Mapping --> Direct[Direct Equivalents]
        Mapping --> Approximate[Approximate Mapping]
        Mapping --> Descriptive[Descriptive Translation]
    end
```

### Translation Approaches

1. **Direct Equivalents**
   - Established Indigenous terms for medical concepts
   - Standardized across dialects where possible
   - Validated by Indigenous health professionals

2. **Approximate Mapping**
   - Closest cultural concept when direct translation unavailable
   - Explanatory context added when needed
   - Consistent across the application

3. **Descriptive Translation**
   - Functional descriptions for concepts without equivalents
   - Developed with community health workers
   - Consistent use of descriptive patterns

### Terminology Database

| English Term | Concept | Plains Cree | Inuktitut | Ojibwe | Notes |
|--------------|---------|-------------|-----------|--------|-------|
| Diabetes | Metabolic disorder | "sōkāwāspinewin" | "aukarnirungnasiarvik" | "sogiipiinendamowin" | Descriptive terms that refer to "sugar disease" |
| Blood pressure | Cardiovascular | "mīkowiyin kaohci-sekpayik" | "aunga tunngata" | "miskwi bangishkogaadeg" | Concept translated as "force of blood" |
| Depression | Mental health | "kaskeyihtamowin" | "qiiqsuungniq" | "gashkendamowin" | Concept varies culturally |

## Voice Command Localization

```mermaid
sequenceDiagram
    participant User
    participant VoiceSystem
    participant LanguageModel
    participant CommandProcessor
    
    User->>VoiceSystem: Speak command (Indigenous language)
    VoiceSystem->>LanguageModel: Process speech
    LanguageModel->>CommandProcessor: Map to command intent
    CommandProcessor->>VoiceSystem: Execute command
    VoiceSystem->>User: Confirm in same language
    
    Note over LanguageModel,CommandProcessor: Intent mapping is language-agnostic
```

### Voice Localization Features

1. **Language-Specific Recognition**
   - Dedicated acoustic models for each language
   - Dialect variation training
   - Recognition threshold adjustment by language

2. **Command Intent Mapping**
   - Language-agnostic intent extraction
   - Consistent command structure across languages
   - Synonyms and variations support

3. **Response Generation**
   - Culturally appropriate responses
   - Proper pronunciation in TTS responses
   - Appropriate formality levels

## Testing and Validation

```mermaid
graph TD
    subgraph "Localization Testing"
        Testing[Testing Process] --> Visual[Visual Testing]
        Testing --> Functional[Functional Testing]
        Testing --> Community[Community Testing]
        
        Visual --> Layout[Layout Verification]
        Visual --> Typography[Typography Check]
        Visual --> Consistency[Visual Consistency]
        
        Functional --> Navigation[Navigation Flow]
        Functional --> Features[Feature Functionality]
        Functional --> Voice[Voice Commands]
        
        Community --> ElderReview[Elder Review]
        Community --> UsabilityTest[Usability Testing]
        Community --> AccuracyCheck[Translation Accuracy]
    end
```

### Testing Methodology

1. **Automated Testing**
   - Missing translation detection
   - Variable placeholder validation
   - Layout overflow detection
   - Accessibility compliance

2. **Manual Testing**
   - Language switching in all contexts
   - Voice recognition accuracy testing
   - UI rendering across devices
   - Cultural appropriateness review

3. **Community Validation**
   - Elder review of terminology and phrasing
   - Indigenous healthcare provider accuracy check
   - Community member usability testing
   - Feedback collection and implementation

## Localization Resources

### Development Tools

- **i18next Ecosystem**
  - i18next core library
  - react-i18next for React integration
  - i18next-http-backend for loading translations
  - i18next-browser-languagedetector for detection

- **Indigenous Language Tools**
  - Aboriginal Sans font for syllabics
  - Syllabic input methods integration
  - Specialized voice recognition models
  - Custom pluralization rules

### Content Creation Resources

- **Style Guides**
  - Language-specific style guides
  - Medical terminology glossaries
  - Cultural reference documentation
  - Visual design guidelines for multilingual content

- **Translation Memory**
  - Centralized translation memory
  - Glossary of approved terms
  - Context screenshots library
  - Previous version translations

## Future Localization Roadmap

```mermaid
graph TD
    subgraph "Future Development"
        Future[Roadmap] --> Languages[Additional Languages]
        Future --> Technology[Technology Enhancements]
        Future --> Content[Content Expansion]
        
        Languages --> Languages1[Blackfoot]
        Languages --> Languages2[Mi'kmaq]
        Languages --> Languages3[Stoney Nakoda]
        
        Technology --> Tech1[Advanced Voice Models]
        Technology --> Tech2[Offline Translation]
        Technology --> Tech3[Adaptive Dialect Learning]
        
        Content --> Content1[Video Localization]
        Content --> Content2[Audio Health Resources]
        Content --> Content3[Interactive Educational Content]
    end
```

### Planned Enhancements

1. **Language Expansion**
   - Addition of Blackfoot, Mi'kmaq, and Stoney Nakoda
   - Enhanced dialect support for existing languages
   - Region-specific terminology variations

2. **Technology Improvements**
   - More sophisticated voice recognition models
   - Enhanced text-to-speech for Indigenous languages
   - On-device translation capabilities
   - Machine learning for dialect adaptation

3. **Content Localization**
   - Expanded health education content
   - Multimedia localization (videos, animations)
   - Interactive tutorials in all languages
   - Culturally specific content modules 