/* ============================================================
   CATÁLOGO DE MEDICAMENTOS — FarmaConsulta
   ============================================================ */

export const MEDICATIONS = [
  /* ============ SISTEMA NERVIOSO / DOLOR ============ */
  {
    id: 1, name: 'Paracetamol', activeIngredient: 'Acetaminofén',
    category: 'Analgésico', purpose: 'Dolor leve a moderado y fiebre',
    keywords: ['DOLOR', 'CABEZA', 'FIEBRE', 'MUSCULAR', 'GRIPE', 'RESFRIADO'],
    description: 'Alivia el dolor de cabeza, muscular y reduce la fiebre. Suave con el estómago.',
    badges: ['Venta libre', 'Adultos', 'Pediatría'],
  },
  {
    id: 2, name: 'Ibuprofeno', activeIngredient: 'Ibuprofeno',
    category: 'Antiinflamatorio', purpose: 'Inflamación, dolor y fiebre',
    keywords: ['DOLOR', 'INFLAMACION', 'FIEBRE', 'ARTICULAR', 'MENSTRUAL', 'MUSCULAR', 'CABEZA'],
    description: 'Antiinflamatorio no esteroideo (AINE). Útil en dolores articulares y menstruales.',
    badges: ['Venta libre', 'Adultos', 'Con alimentos'],
  },
  {
    id: 3, name: 'Diclofenaco gel', activeIngredient: 'Diclofenaco sódico',
    category: 'Antiinflamatorio', purpose: 'Dolor muscular localizado',
    keywords: ['DOLOR', 'MUSCULAR', 'ARTICULAR', 'GOLPE', 'TORCEDURA', 'CONTRACTURA', 'ESPASMO'],
    description: 'Gel de aplicación tópica para golpes, torceduras y contracturas.',
    badges: ['Venta libre', 'Tópico', 'Adultos'],
  },
  {
    id: 4, name: 'Sumatriptán', activeIngredient: 'Sumatriptán succinato',
    category: 'Antimigrañoso', purpose: 'Migraña y cefalea intensa',
    keywords: ['MIGRANA', 'CABEZA', 'DOLOR', 'NEURALGIA', 'NAUSEA'],
    description: 'Agonista selectivo de serotonina. Alivia crisis de migraña con o sin aura.',
    badges: ['Receta', 'Adultos'],
  },
  {
    id: 5, name: 'Carbamazepina', activeIngredient: 'Carbamazepina',
    category: 'Anticonvulsivo', purpose: 'Epilepsia y neuralgia del trigémino',
    keywords: ['EPILEPSIA', 'CONVULSION', 'NEURALGIA', 'CABEZA', 'DOLOR'],
    description: 'Anticonvulsivante de primera línea. Requiere monitoreo periódico.',
    badges: ['Receta', 'Crónico', 'Embarazo'],
  },
  {
    id: 6, name: 'Pregabalina', activeIngredient: 'Pregabalina',
    category: 'Anticonvulsivo', purpose: 'Neuralgia y dolor neuropático',
    keywords: ['NEURALGIA', 'DOLOR', 'NERVIO', 'ANSIEDAD'],
    description: 'Alivia el dolor neuropático y la neuralgia postherpética. También en epilepsia.',
    badges: ['Receta', 'Crónico', 'Sedante'],
  },
  {
    id: 7, name: 'Sertralina', activeIngredient: 'Clorhidrato de sertralina',
    category: 'Antidepresivo', purpose: 'Depresión y trastornos de ansiedad',
    keywords: ['DEPRESION', 'ANSIEDAD', 'PANICO', 'ESTRES', 'ESTADO_ANIMO'],
    description: 'Inhibidor selectivo de recaptación de serotonina (ISRS). Efecto gradual.',
    badges: ['Receta', 'Crónico', 'Embarazo'],
  },
  {
    id: 8, name: 'Alprazolam', activeIngredient: 'Alprazolam',
    category: 'Ansiolítico', purpose: 'Ansiedad, pánico y estrés',
    keywords: ['ANSIEDAD', 'PANICO', 'ESTRES', 'SUEÑO', 'INSOMNIO'],
    description: 'Benzodiazepina de acción rápida. Uso por períodos cortos y bajo supervisión.',
    badges: ['Receta', 'Sedante', 'Crónico'],
  },
  {
    id: 9, name: 'Zolpidem', activeIngredient: 'Tartrato de zolpidem',
    category: 'Hipnótico', purpose: 'Insomnio de corta duración',
    keywords: ['INSOMNIO', 'SUEÑO', 'DORMIR'],
    description: 'Hipnótico no benzodiazepínico. Facilita la conciliación del sueño.',
    badges: ['Receta', 'Sedante'],
  },
  {
    id: 10, name: 'Metocarbamol', activeIngredient: 'Metocarbamol',
    category: 'Relajante muscular', purpose: 'Espasmos musculares y contracturas',
    keywords: ['ESPASMO', 'MUSCULAR', 'CONTRACTURA', 'DOLOR', 'COLICO'],
    description: 'Relajante muscular de acción central. Usado en lumbalgias y tortícolis.',
    badges: ['Receta', 'Adultos', 'Sedante'],
  },
  {
    id: 11, name: 'Lidocaína', activeIngredient: 'Clorhidrato de lidocaína',
    category: 'Anestésico', purpose: 'Anestesia local y alivio del dolor superficial',
    keywords: ['ANESTESIA', 'DOLOR', 'PICOR', 'PIEL', 'HERIDA'],
    description: 'Anestésico local de uso tópico o inyectable. Alivia dolor e irritación.',
    badges: ['Receta', 'Tópico', 'Hospitalario'],
  },

  /* ============ SISTEMA RESPIRATORIO ============ */
  {
    id: 12, name: 'Loratadina', activeIngredient: 'Loratadina',
    category: 'Antihistamínico', purpose: 'Alergias y rinitis alérgica',
    keywords: ['ALERGIA', 'RINITIS', 'ESTORNUDO', 'PICOR', 'CONGESTION', 'PIEL'],
    description: 'Alivia estornudos, picazón y congestión nasal sin causar somnolencia marcada.',
    badges: ['Venta libre', 'Adultos', 'No sedante'],
  },
  {
    id: 13, name: 'Cetirizina', activeIngredient: 'Diclorhidrato de cetirizina',
    category: 'Antihistamínico', purpose: 'Urticaria y alergias cutáneas',
    keywords: ['ALERGIA', 'URTICARIA', 'PICOR', 'PIEL', 'RONCHA', 'ESTORNUDO'],
    description: 'Antihistamínico de segunda generación. Puede causar leve somnolencia.',
    badges: ['Venta libre', 'Adultos', 'Sedante'],
  },
  {
    id: 14, name: 'Dextrometorfano', activeIngredient: 'Dextrometorfano bromhidrato',
    category: 'Antitusígeno', purpose: 'Tos seca e irritativa',
    keywords: ['TOS', 'TOS_SECA', 'IRRITACION', 'GARGANTA', 'RESPIRACION'],
    description: 'Supresor central de la tos. Ideal para tos seca sin expectoración.',
    badges: ['Venta libre', 'Adultos', 'Pediatría'],
  },
  {
    id: 15, name: 'Ambroxol', activeIngredient: 'Clorhidrato de ambroxol',
    category: 'Mucolítico', purpose: 'Tos productiva y flemas',
    keywords: ['TOS', 'FLEMA', 'MOCO', 'RESPIRACION', 'CONGESTION'],
    description: 'Fluidifica las secreciones bronquiales facilitando su eliminación.',
    badges: ['Venta libre', 'Adultos', 'Pediatría'],
  },
  {
    id: 16, name: 'Guaifenesina', activeIngredient: 'Guaifenesina',
    category: 'Expectorante', purpose: 'Tos con congestión y flemas',
    keywords: ['TOS', 'FLEMA', 'CONGESTION', 'PECHO', 'RESPIRACION'],
    description: 'Aumenta la fluidez de las secreciones para facilitar la expulsión.',
    badges: ['Venta libre', 'Adultos'],
  },
  {
    id: 17, name: 'Salbutamol', activeIngredient: 'Sulfato de salbutamol',
    category: 'Broncodilatador', purpose: 'Asma y broncoespasmo',
    keywords: ['ASMA', 'RESPIRACION', 'BRONCOESPASMO', 'TOS', 'PECHO'],
    description: 'Broncodilatador de acción rápida para crisis asmáticas. Inhalador de rescate.',
    badges: ['Receta', 'Inhalador', 'Rescate'],
  },
  {
    id: 18, name: 'Budesonida', activeIngredient: 'Budesonida',
    category: 'Broncodilatador', purpose: 'Asma persistente y rinitis alérgica',
    keywords: ['ASMA', 'RESPIRACION', 'ALERGIA', 'RINITIS', 'CONGESTION'],
    description: 'Corticoide inhalado. Controla la inflamación de las vías respiratorias.',
    badges: ['Receta', 'Inhalador', 'Crónico'],
  },
  {
    id: 19, name: 'Oximetazolina', activeIngredient: 'Clorhidrato de oximetazolina',
    category: 'Descongestionante nasal', purpose: 'Congestión nasal',
    keywords: ['CONGESTION', 'NARIZ', 'RINITIS', 'RESFRIADO', 'GRIPE'],
    description: 'Descongestionante nasal de acción prolongada. Uso máximo 3 días.',
    badges: ['Venta libre', 'Adultos', 'Tópico'],
  },

  /* ============ SISTEMA DIGESTIVO ============ */
  {
    id: 20, name: 'Omeprazol', activeIngredient: 'Omeprazol',
    category: 'Antiulceroso', purpose: 'Acidez, reflujo y úlcera gástrica',
    keywords: ['ACIDEZ', 'REFLUJO', 'ARDOR', 'GASTRITIS', 'ESTOMAGO', 'ULCERA'],
    description: 'Inhibidor de bomba de protones. Reduce la producción de ácido estomacal.',
    badges: ['Receta', 'Adultos', 'Antes de comer'],
  },
  {
    id: 21, name: 'Hidróxido de aluminio', activeIngredient: 'Hidróxido de aluminio y magnesio',
    category: 'Antiácido', purpose: 'Acidez y molestias estomacales',
    keywords: ['ACIDEZ', 'ARDOR', 'ESTOMAGO', 'DIGESTION', 'GASTRITIS'],
    description: 'Neutraliza el ácido del estómago aliviando ardor y pesadez.',
    badges: ['Venta libre', 'Adultos', 'Embarazo'],
  },
  {
    id: 22, name: 'Metoclopramida', activeIngredient: 'Clorhidrato de metoclopramida',
    category: 'Antiemético', purpose: 'Náuseas y vómitos',
    keywords: ['NAUSEA', 'VOMITO', 'MAREO', 'ESTOMAGO', 'MIGRANA'],
    description: 'Procinético y antiemético. Alivia náuseas y acelera el vaciado gástrico.',
    badges: ['Receta', 'Adultos'],
  },
  {
    id: 23, name: 'Loperamida', activeIngredient: 'Clorhidrato de loperamida',
    category: 'Antidiarreico', purpose: 'Diarrea aguda y crónica',
    keywords: ['DIARREA', 'DEPOSICION', 'INTESTINO', 'DESHIDRATACION'],
    description: 'Reduce la motilidad intestinal. No reemplaza la rehidratación.',
    badges: ['Venta libre', 'Adultos'],
  },
  {
    id: 24, name: 'Bisacodilo', activeIngredient: 'Bisacodilo',
    category: 'Laxante', purpose: 'Estreñimiento ocasional',
    keywords: ['ESTREÑIMIENTO', 'INTESTINO', 'DEPOSICION'],
    description: 'Laxante estimulante. Actúa entre 6 y 12 horas después de la toma.',
    badges: ['Venta libre', 'Adultos'],
  },
  {
    id: 25, name: 'Simeticona', activeIngredient: 'Simeticona',
    category: 'Antiflatulento', purpose: 'Gases y distensión abdominal',
    keywords: ['GASES', 'FLATULENCIA', 'DISTENSION', 'ABDOMEN', 'ESTOMAGO'],
    description: 'Rompe las burbujas de gas en el tracto digestivo aliviando la hinchazón.',
    badges: ['Venta libre', 'Adultos', 'Pediatría'],
  },
  {
    id: 26, name: 'Butilhioscina', activeIngredient: 'Bromuro de butilhioscina',
    category: 'Antiespasmódico', purpose: 'Espasmos gastrointestinales y cólicos',
    keywords: ['COLICO', 'ESPASMO', 'DOLOR', 'ABDOMEN', 'MENSTRUAL', 'ESTOMAGO'],
    description: 'Antiespasmódico. Alivia cólicos menstruales e intestinales.',
    badges: ['Receta', 'Adultos'],
  },
  {
    id: 27, name: 'Lactobacillus', activeIngredient: 'Lactobacillus acidophilus',
    category: 'Probiótico', purpose: 'Restauración de la flora intestinal',
    keywords: ['FLORA', 'INTESTINO', 'DIARREA', 'DEFENSAS', 'INMUNE'],
    description: 'Repone bacterias beneficiosas. Útil tras antibióticos o diarreas.',
    badges: ['Venta libre', 'Pediatría', 'Adultos'],
  },

  /* ============ SISTEMA CARDIOVASCULAR ============ */
  {
    id: 28, name: 'Enalapril', activeIngredient: 'Maleato de enalapril',
    category: 'Antihipertensivo', purpose: 'Hipertensión arterial',
    keywords: ['PRESION', 'HIPERTENSION', 'CORAZON', 'RIÑON'],
    description: 'Inhibidor de la ECA. Disminuye la presión arterial y protege el corazón.',
    badges: ['Receta', 'Crónico', 'Embarazo'],
  },
  {
    id: 29, name: 'Losartán', activeIngredient: 'Losartán potásico',
    category: 'Antihipertensivo', purpose: 'Hipertensión y protección cardíaca',
    keywords: ['PRESION', 'HIPERTENSION', 'CORAZON', 'RIÑON'],
    description: 'Antagonista de receptores de angiotensina II. Alternativa a los IECA.',
    badges: ['Receta', 'Crónico', 'Embarazo'],
  },
  {
    id: 30, name: 'Furosemida', activeIngredient: 'Furosemida',
    category: 'Diurético', purpose: 'Retención de líquidos e hipertensión',
    keywords: ['EDEMA', 'LIQUIDO', 'PRESION', 'RIÑON', 'CORAZON'],
    description: 'Diurético de asa. Elimina el exceso de líquidos y baja la presión.',
    badges: ['Receta', 'Crónico'],
  },
  {
    id: 31, name: 'Warfarina', activeIngredient: 'Warfarina sódica',
    category: 'Anticoagulante', purpose: 'Prevención de trombos y embolias',
    keywords: ['COAGULO', 'TROMBO', 'CORAZON', 'SANGRADO', 'PRESION'],
    description: 'Anticoagulante oral. Requiere control periódico del INR.',
    badges: ['Receta', 'Crónico', 'Embarazo'],
  },
  {
    id: 32, name: 'Ácido acetilsalicílico', activeIngredient: 'Ácido acetilsalicílico',
    category: 'Antiagregante', purpose: 'Prevención cardiovascular',
    keywords: ['COAGULO', 'CORAZON', 'INFARTO', 'PRESION', 'DOLOR'],
    description: 'Antiagregante plaquetario en dosis bajas. Prevención de eventos cardiovasculares.',
    badges: ['Venta libre', 'Adultos', 'Crónico'],
  },
  {
    id: 33, name: 'Atorvastatina', activeIngredient: 'Atorvastatina cálcica',
    category: 'Hipolipemiante', purpose: 'Colesterol alto',
    keywords: ['COLESTEROL', 'TRIGLICERIDOS', 'CORAZON', 'GRASA'],
    description: 'Estatina que reduce el colesterol LDL y previene eventos cardiovasculares.',
    badges: ['Receta', 'Crónico', 'Embarazo'],
  },

  /* ============ ANTIINFECCIOSOS ============ */
  {
    id: 34, name: 'Amoxicilina', activeIngredient: 'Amoxicilina trihidrato',
    category: 'Antibiótico', purpose: 'Infecciones bacterianas',
    keywords: ['INFECCION', 'BACTERIA', 'GARGANTA', 'RESPIRATORIA', 'URINARIA'],
    description: 'Antibiótico de amplio espectro. Requiere prescripción y esquema completo.',
    badges: ['Receta', 'Adultos', 'Pediatría'],
  },
  {
    id: 35, name: 'Azitromicina', activeIngredient: 'Azitromicina dihidrato',
    category: 'Antibiótico', purpose: 'Infecciones respiratorias y de piel',
    keywords: ['INFECCION', 'RESPIRATORIA', 'PIEL', 'BACTERIA', 'HERIDA'],
    description: 'Antibiótico macrólido. Tratamientos cortos supervisados por médico.',
    badges: ['Receta', 'Adultos', 'Pediatría'],
  },
  {
    id: 36, name: 'Aciclovir', activeIngredient: 'Aciclovir',
    category: 'Antiviral', purpose: 'Herpes simple y varicela',
    keywords: ['HERPES', 'VARICELA', 'VIRUS', 'PIEL', 'LABIO'],
    description: 'Antiviral específico. Más eficaz si se inicia en las primeras 24 horas.',
    badges: ['Receta', 'Adultos', 'Tópico'],
  },
  {
    id: 37, name: 'Fluconazol', activeIngredient: 'Fluconazol',
    category: 'Antifúngico', purpose: 'Candidiasis y hongos',
    keywords: ['HONGO', 'CANDIDIASIS', 'PICOR', 'PIEL', 'GENITAL', 'RONCHA'],
    description: 'Antifúngico triazólico. Trata infecciones por hongos a nivel sistémico.',
    badges: ['Receta', 'Adultos', 'Embarazo'],
  },
  {
    id: 38, name: 'Clotrimazol', activeIngredient: 'Clotrimazol',
    category: 'Antifúngico', purpose: 'Hongos cutáneos y vaginales',
    keywords: ['HONGO', 'PICOR', 'PIEL', 'RONCHA', 'GENITAL'],
    description: 'Antifúngico tópico. Trata micosis cutáneas y candidiasis vaginal.',
    badges: ['Venta libre', 'Tópico', 'Adultos'],
  },
  {
    id: 39, name: 'Albendazol', activeIngredient: 'Albendazol',
    category: 'Antiparasitario', purpose: 'Parasitosis intestinal',
    keywords: ['PARASITO', 'LOMBRICES', 'INTESTINO', 'DIARREA'],
    description: 'Antihelmíntico de amplio espectro. Dosis única en la mayoría de casos.',
    badges: ['Receta', 'Pediatría', 'Adultos'],
  },
  {
    id: 40, name: 'Clorhexidina', activeIngredient: 'Gluconato de clorhexidina',
    category: 'Antiséptico', purpose: 'Desinfección de heridas y piel',
    keywords: ['HERIDA', 'DESINFECCION', 'BACTERIA', 'PIEL'],
    description: 'Antiséptico de amplio espectro. Uso tópico en piel y mucosas.',
    badges: ['Venta libre', 'Tópico', 'Adultos'],
  },
  {
    id: 41, name: 'Povidona yodada', activeIngredient: 'Povidona yodada',
    category: 'Antiséptico', purpose: 'Desinfección de heridas y quemaduras',
    keywords: ['HERIDA', 'DESINFECCION', 'BACTERIA', 'PIEL', 'QUEMADURA'],
    description: 'Antiséptico yodado de amplio espectro. Apto para heridas abiertas.',
    badges: ['Venta libre', 'Tópico', 'Adultos'],
  },

  /* ============ ENDOCRINO / METABÓLICO ============ */
  {
    id: 42, name: 'Metformina', activeIngredient: 'Clorhidrato de metformina',
    category: 'Antidiabético', purpose: 'Diabetes tipo 2',
    keywords: ['DIABETES', 'GLUCOSA', 'AZUCAR'],
    description: 'Reduce la glucosa en sangre mejorando la sensibilidad a la insulina.',
    badges: ['Receta', 'Crónico', 'Con alimentos'],
  },
  {
    id: 43, name: 'Glibenclamida', activeIngredient: 'Glibenclamida',
    category: 'Antidiabético', purpose: 'Diabetes tipo 2 (segunda línea)',
    keywords: ['DIABETES', 'GLUCOSA', 'AZUCAR'],
    description: 'Sulfonilurea que estimula la secreción de insulina por el páncreas.',
    badges: ['Receta', 'Crónico', 'Con alimentos'],
  },
  {
    id: 44, name: 'Dexametasona', activeIngredient: 'Fosfato sódico de dexametasona',
    category: 'Corticoide', purpose: 'Inflamación severa y alergias graves',
    keywords: ['INFLAMACION', 'ALERGIA', 'GRAVE', 'RONCHA', 'PICOR'],
    description: 'Corticoide potente. Uso hospitalario o bajo estricta prescripción.',
    badges: ['Receta', 'Hospitalario', 'Embarazo'],
  },
  {
    id: 45, name: 'Levotiroxina', activeIngredient: 'Levotiroxina sódica',
    category: 'Tiroideo', purpose: 'Hipotiroidismo',
    keywords: ['TIROIDES', 'HIPOTIROIDISMO', 'METABOLISMO', 'ENERGIA', 'FATIGA'],
    description: 'Hormona tiroidea sintética. Reemplaza la producción natural de tiroxina.',
    badges: ['Receta', 'Crónico', 'Antes de comer'],
  },
  {
    id: 46, name: 'Etinilestradiol', activeIngredient: 'Etinilestradiol + levonorgestrel',
    category: 'Anticonceptivo', purpose: 'Prevención del embarazo',
    keywords: ['ANTICONCEPTIVO', 'EMBARAZO', 'HORMONA', 'CICLO', 'MENSTRUAL'],
    description: 'Anticonceptivo oral combinado. Debe tomarse a la misma hora cada día.',
    badges: ['Receta', 'Adultos', 'Embarazo'],
  },

  /* ============ OTROS ============ */
  {
    id: 47, name: 'Suero oral', activeIngredient: 'Sales de rehidratación oral',
    category: 'Rehidratante', purpose: 'Deshidratación por diarrea o vómito',
    keywords: ['DESHIDRATACION', 'DIARREA', 'VOMITO', 'FATIGA'],
    description: 'Repone electrolitos y agua perdidos. Apto para toda la familia.',
    badges: ['Venta libre', 'Pediatría', 'Adultos'],
  },
  {
    id: 48, name: 'Vitamina C', activeIngredient: 'Ácido ascórbico',
    category: 'Vitamina', purpose: 'Refuerzo del sistema inmune',
    keywords: ['DEFENSAS', 'INMUNE', 'GRIPE', 'RESFRIADO', 'FATIGA'],
    description: 'Antioxidante esencial. Apoya defensas en periodos de resfriado.',
    badges: ['Venta libre', 'Adultos', 'Pediatría'],
  },
  {
    id: 49, name: 'Complejo B', activeIngredient: 'Vitaminas B1, B6 y B12',
    category: 'Suplemento', purpose: 'Déficit vitamínico y fatiga',
    keywords: ['FATIGA', 'ENERGIA', 'NERVIO', 'DEFENSAS', 'NEURALGIA'],
    description: 'Suplemento vitamínico del grupo B. Apoya el sistema nervioso y la energía.',
    badges: ['Venta libre', 'Adultos', 'Crónico'],
  },
  {
    id: 50, name: 'Timolol', activeIngredient: 'Timolol maleato',
    category: 'Oftálmico', purpose: 'Glaucoma y presión intraocular',
    keywords: ['GLAUCOMA', 'OJO', 'VISION', 'PRESION'],
    description: 'Betabloqueante oftálmico. Reduce la presión intraocular en el glaucoma.',
    badges: ['Receta', 'Crónico', 'Tópico'],
  },
  {
    id: 51, name: 'Lágrimas artificiales', activeIngredient: 'Carboximetilcelulosa sódica',
    category: 'Oftálmico', purpose: 'Ojo seco e irritación ocular',
    keywords: ['OJO', 'SEQUEDAD', 'IRRITACION', 'VISION', 'ALERGIA'],
    description: 'Lubricante ocular. Alivia la sequedad y el ardor en los ojos.',
    badges: ['Venta libre', 'Tópico', 'Adultos'],
  },
  {
    id: 52, name: 'Hidrocortisona crema', activeIngredient: 'Hidrocortisona',
    category: 'Dermatológico', purpose: 'Dermatitis y picazón cutánea',
    keywords: ['PICOR', 'PIEL', 'ALERGIA', 'DERMATITIS', 'RONCHA'],
    description: 'Corticoide tópico de baja potencia. Alivia inflamación y picazón local.',
    badges: ['Venta libre', 'Tópico', 'Adultos'],
  },
  {
    id: 53, name: 'Alopurinol', activeIngredient: 'Alopurinol',
    category: 'Antigotoso', purpose: 'Gota y ácido úrico alto',
    keywords: ['GOTA', 'ACIDO_URICO', 'ARTICULACION', 'DOLOR'],
    description: 'Reduce la producción de ácido úrico. Previene crisis de gota.',
    badges: ['Receta', 'Crónico', 'Con alimentos'],
  },
  {
    id: 54, name: 'Sulfato ferroso', activeIngredient: 'Sulfato ferroso',
    category: 'Antianémico', purpose: 'Anemia ferropénica',
    keywords: ['ANEMIA', 'HIERRO', 'FATIGA', 'SANGRADO', 'DEFENSAS'],
    description: 'Suplemento de hierro. Trata y previene la anemia por deficiencia de hierro.',
    badges: ['Venta libre', 'Adultos', 'Embarazo'],
  },
  {
    id: 55, name: 'Vacuna antigripal', activeIngredient: 'Virus influenza inactivado',
    category: 'Vacuna', purpose: 'Prevención de la gripe estacional',
    keywords: ['GRIPE', 'INFLUENZA', 'PREVENCION', 'DEFENSAS', 'INMUNE'],
    description: 'Vacuna anual. Recomendada en mayores de 65 años y grupos de riesgo.',
    badges: ['Receta', 'Adultos', 'Pediatría'],
  },
];

/* ============================================================
   CATEGORÍAS
   ============================================================ */

export const CATEGORIES = [
  // Sistema Nervioso / Dolor
  'Analgésico', 'Antipirético', 'Antiinflamatorio', 'Antimigrañoso',
  'Anticonvulsivo', 'Antidepresivo', 'Ansiolítico', 'Hipnótico',
  'Relajante muscular', 'Anestésico',
  // Sistema Respiratorio
  'Antihistamínico', 'Antitusígeno', 'Mucolítico', 'Expectorante',
  'Broncodilatador', 'Descongestionante nasal',
  // Sistema Digestivo
  'Gastrointestinal', 'Antiácido', 'Antiulceroso', 'Antiemético',
  'Antidiarreico', 'Laxante', 'Antiflatulento', 'Antiespasmódico', 'Probiótico',
  // Sistema Cardiovascular
  'Cardiovascular', 'Antihipertensivo', 'Diurético', 'Anticoagulante',
  'Antiagregante', 'Hipolipemiante',
  // Antiinfecciosos
  'Antibiótico', 'Antiviral', 'Antifúngico', 'Antiparasitario', 'Antiséptico',
  // Endocrino / Metabólico
  'Antidiabético', 'Corticoide', 'Hormonal', 'Anticonceptivo', 'Tiroideo',
  // Otros
  'Rehidratante', 'Suplemento', 'Vitamina', 'Oftálmico', 'Ótico',
  'Dermatológico', 'Antigotoso', 'Antianémico', 'Inmunosupresor', 'Vacuna',
];

export const CATEGORY_GROUPS = [
  {
    label: 'Sistema Nervioso / Dolor',
    options: ['Analgésico', 'Antipirético', 'Antiinflamatorio', 'Antimigrañoso', 'Anticonvulsivo', 'Antidepresivo', 'Ansiolítico', 'Hipnótico', 'Relajante muscular', 'Anestésico'],
  },
  {
    label: 'Sistema Respiratorio',
    options: ['Antihistamínico', 'Antitusígeno', 'Mucolítico', 'Expectorante', 'Broncodilatador', 'Descongestionante nasal'],
  },
  {
    label: 'Sistema Digestivo',
    options: ['Gastrointestinal', 'Antiácido', 'Antiulceroso', 'Antiemético', 'Antidiarreico', 'Laxante', 'Antiflatulento', 'Antiespasmódico', 'Probiótico'],
  },
  {
    label: 'Sistema Cardiovascular',
    options: ['Cardiovascular', 'Antihipertensivo', 'Diurético', 'Anticoagulante', 'Antiagregante', 'Hipolipemiante'],
  },
  {
    label: 'Antiinfecciosos',
    options: ['Antibiótico', 'Antiviral', 'Antifúngico', 'Antiparasitario', 'Antiséptico'],
  },
  {
    label: 'Endocrino / Metabólico',
    options: ['Antidiabético', 'Corticoide', 'Hormonal', 'Anticonceptivo', 'Tiroideo'],
  },
  {
    label: 'Otros',
    options: ['Rehidratante', 'Suplemento', 'Vitamina', 'Oftálmico', 'Ótico', 'Dermatológico', 'Antigotoso', 'Antianémico', 'Inmunosupresor', 'Vacuna'],
  },
];

export const CATEGORY_FEATURED = [
  'Todas',
  'Analgésico',
  'Antiinflamatorio',
  'Antibiótico',
  'Antihistamínico',
  'Gastrointestinal',
  'Respiratorio',
  'Cardiovascular',
  'Antidiabético',
  'Corticoide',
  'Dermatológico',
  'Vitamina',
];

/* ============================================================
   TAGS DE FINALIDAD
   ============================================================ */

export const PURPOSE_TAGS = [
  'DOLOR', 'CABEZA', 'FIEBRE', 'MUSCULAR', 'ARTICULAR', 'MENSTRUAL',
  'MIGRANA', 'NEURALGIA', 'COLICO', 'ESPASMO',
  'TOS', 'TOS_SECA', 'FLEMA', 'GRIPE', 'RESFRIADO', 'CONGESTION',
  'ASMA', 'RESPIRACION', 'ALERGIA', 'RINITIS', 'ESTORNUDO',
  'ACIDEZ', 'REFLUJO', 'ARDOR', 'GASTRITIS', 'ESTOMAGO', 'ULCERA',
  'NAUSEA', 'VOMITO', 'DIARREA', 'ESTREÑIMIENTO', 'GASES',
  'INFECCION', 'BACTERIA', 'VIRUS', 'HONGO', 'PARASITO', 'HERIDA',
  'PRESION', 'HIPERTENSION', 'CORAZON', 'COLESTEROL',
  'DIABETES', 'GLUCOSA', 'TIROIDES',
  'ANSIEDAD', 'DEPRESION', 'INSOMNIO', 'SUEÑO', 'ESTRES', 'PANICO',
  'PIEL', 'PICOR', 'RONCHA', 'OJO',
  'ANEMIA', 'DEFENSAS', 'INMUNE', 'GOTA', 'ACIDO_URICO',
  'DESHIDRATACION', 'FATIGA',
];

export const SEARCH_SCOPES = [
  { id: 'name',    label: 'Nombre',           hint: 'Nombre del medicamento', icon: 'pills' },
  { id: 'active',  label: 'Principio activo', hint: 'Principio activo',        icon: 'flask' },
  { id: 'purpose', label: 'Finalidad',        hint: 'Finalidad / Síntoma',     icon: 'stethoscope' },
];