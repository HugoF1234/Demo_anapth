# Règles Métier — Système de Transcription Vocale
## Comptes-Rendus Anatomopathologiques

---

## 1. Correspondances Transcription ↔ Document

| Transcription | Fichier | Type de prélèvement |
|---|---|---|
| Transcription 1 | 1.docx | Biopsie lésion pulmonaire lobe inférieur droit |
| Transcription 2 | 2.docx | Biopsies bronchiques + Liquide de LBA |
| Transcription 3 | 3.docx | Pièce opératoire (lobectomie + curage ganglionnaire) |
| Transcription 4 | 4.docx | Biopsie marge anale (AIN3) |
| Transcription 5 | 5.docx | Biopsies canal anal (x2 sites) |

---

## 2. Dictionnaire de Corrections Phonétiques

> Ces erreurs de reconnaissance vocale sont systématiques et doivent être corrigées **avant toute interprétation sémantique**.

| Transcription brute (oral) | Terme correct | Commentaire |
|---|---|---|
| branchique / branchiques | bronchique / bronchiques | Confusion phonétique récurrente |
| en plan chic | bronchique | Déformation forte |
| mucose | muqueuse | Troncature syllabique |
| fibro-yalin | fibro-hyalin | H aspiré non capté |
| trauma | stroma | Confusion consonantique |
| racineuse | acineuse | Perte du 'a' initial |
| DTF1 / DTF1+ | TTF1 / TTF1+ | Confusion D/T |
| yaline | hyaline | H aspiré non capté |
| cananal | canal | Répétition accidentelle |
| ulière | hilaire | H aspiré + déformation |
| parenchymate | parenchymateuse | Troncature |

> ⚠️ **RÈGLE CRITIQUE** : `"pas de cellule normale"` dans un CR cytologique = `"Il n'est pas observé de cellule anormale"`. Le LLM doit reconnaître que **"normale"** est ici une erreur de transcription d'**"anormale"**. La négation médicale ne doit **JAMAIS** être inversée.

---

## 3. Dictionnaire des Acronymes et Abréviations

### 3.1 Acronymes diagnostiques

| Abréviation orale | Terme complet dans le CR | Contexte |
|---|---|---|
| AIN1 / IN1 | lésion malpighienne intraépithéliale de bas grade (AIN1) | Canal anal / marge anale |
| AIN2 | lésion malpighienne intraépithéliale de grade intermédiaire (AIN2) | Canal anal |
| AIN3 / IN3 | néoplasie malpighienne intraépithéliale de haut grade (AIN3) | Canal anal / marge anale |
| ASIL | Anal Squamous Intraepithelial Lesion | Renseignements cliniques uniquement |
| ADK | adénocarcinome | Tous contextes |
| HPV | Human Papillomavirus | Pathologie virale |
| CIS | carcinome in situ | Tous contextes |

### 3.2 Marqueurs immunohistochimiques (IHC)

| Abréviation orale | Formulation complète dans le CR |
|---|---|
| TTF1+ | Marquage nucléaire d'intensité forte de l'ensemble des cellules tumorales |
| TTF1- | Absence de marquage TTF1 |
| ALK- / ALK négatif | Absence de détection de la protéine ALK en immunohistochimie |
| ALK+ | Expression de la protéine ALK détectée en immunohistochimie |
| P16+ / p16+ | Expression forte, diffuse, en bloc, de p16 par la lésion |
| PD-L1 X% | Marquage membranaire intéressant environ X% des cellules tumorales |
| PD-L1 analyse difficile | *(ajouter)* : "analyse difficile en raison de la présence de cellules immunes marquées et d'artéfacts d'écrasement" |

### 3.3 Cytologie / LBA

| Abréviation orale | Terme complet |
|---|---|
| LBA | liquide de lavage bronchiolo-alvéolaire |
| PNN | polynucléaires neutrophiles |
| PNE | polynucléaires éosinophiles |
| MGG | May-Grünwald-Giemsa (coloration) |
| Perls | coloration de Perls (recherche de sidérophages) |

---

## 4. Structures-Types des Comptes-Rendus (Templates)

### 4.1 Structure générale d'un CR anapath

```
[TITRE EN MAJUSCULES SOULIGNÉ GRAS]

Renseignements cliniques : [si fourni en dictée]

Macroscopie :
[Description standardisée du prélèvement]

Étude histologique / Étude cytologique :
[Description microscopique]

Immunomarquage : [tableau 3 colonnes si ≥ 2 marqueurs IHC]

CONCLUSION :
[Points numérotés en gras]
```

### 4.2 Template : Biopsie simple

**Déclencheur oral :** `"biopsie [site], macro, X cm/mm, X bloc(s), micro [description], conclusion [diagnostic]"`

**Phrases macroscopiques standard selon le contexte :**

| Contexte | Phrase macroscopique générée |
|---|---|
| 1 fragment (biopsie fine) | "Un fragment biopsique de X mm de grand axe, examiné avec réalisation de plans de coupes sériés. Inclusion en un bloc (bloc 1)." |
| 1 prélèvement (pince/pince à biopsie) | "Un prélèvement de X cm, adressé fixé en formol, non orienté. Inclusion en totalité en 1 bloc." |
| 4 fragments | "Quatre fragments biopsiques ont été adressés fixés en formol, inclus en paraffine en un bloc et examinés sur deux plans de coupe." |

### 4.3 Template : Biopsies multiples numérotées

**Ex. biopsies de canal anal en plusieurs sites**

```
BIOPSIES DU [SITE]  ← gras souligné majuscules

1) [Localisation 1]  ← gras souligné
Macroscopie : [phrase standard selon taille]
Microscopie : [description développée]

2) [Localisation 2]
Macroscopie : [phrase standard]
Microscopie : [description développée]

CONCLUSION :
1) [Diagnostic 1 en gras]
2) [Diagnostic 2 en gras]
```

### 4.4 Template : Tableau IHC

Déclenché **automatiquement** si ≥ 2 marqueurs IHC sont dictés.

**Phrase introductive systématique :**
> *"Immunomarquage : réalisé sur tissu fixé et coupes en paraffine, après restauration antigénique par la chaleur, utilisation de l'automate BOND III (Leica) et application des anticorps suivants :"*

**Format du tableau :**

| Anticorps | Résultats | Témoin + |
|---|---|---|
| TTF-1 | [résultat développé] | |
| PD-L1 (clone QR1) | [résultat développé] | |
| ALK (clone 1A4) | [résultat développé] | Externe+ |

> **Règle clone :** le clone est mentionné entre parenthèses s'il est fourni ou implicite (clone QR1 pour PD-L1, clone 1A4 pour ALK).

### 4.5 Template : Cytologie LBA

**Déclencheur oral :** `"LBA, X ml [aspect], X cellules, [description]"`

```
Volume : X mL
Aspect : [blanchâtre trouble / clair / hémorragique…]
Richesse cellulaire à l'état frais : X cellules / mm3, [rares hématies si mentionnées]

Étude cytologique sur produit de cytocentrifugation :

Colorations : MGG, Papanicolaou, Perls
Conservation cellulaire : [bonne / moyenne / altérée]

L'étude cytologique [description développée]
```

### 4.6 Template : Pièce opératoire avec curage

**Déclencheur oral :** `"pièce [organe] avec curage, macro [dimensions], lésion [description], X ganglions [sites]"`

**Structure macroscopique générée :**
> "[Organe] mesurant X × Y × Z cm. On identifie une lésion [description] de X × Y × Z mm, [caractères]. [Description du curage ganglionnaire par station]."

**Inclusions/blocs :** liste numérotée par sites anatomiques (curage, coupe bronchique et vasculaire, tumeur, ganglions, prélèvements systématiques).

---

## 5. Règles de Formatage Word

| Élément | Format appliqué |
|---|---|
| Titre principal (type de prélèvement) | **Gras + Souligné + MAJUSCULES** |
| Sous-titres numérotés (sites multiples) | **Gras + Souligné** |
| Labels de section (Macroscopie, Microscopie…) | **Gras** |
| Contenu descriptif | Normal (non gras) |
| CONCLUSION (label) | **Gras + Souligné + MAJUSCULES** |
| Texte des conclusions | **Gras** |
| Renseignements cliniques | *Italique normal* |
| Note introductive IHC | *Italique normal* |

---

## 6. Règles d'Interprétation Médicale

### 6.1 Expansion des diagnostics courts

| Diagnostic oral court | Description microscopique développée |
|---|---|
| AIN3, p16+ | "Large lésion de néoplasie malpighienne intraépithéliale de haut grade. Désorganisation architecturale intéressant toute l'épaisseur de l'épithélium. Figures de mitose. Expression forte, diffuse, en bloc, de p16." |
| AIN1, HPV | "Lésion papillomateuse acanthosique, focalement parakératosique avec signes de virose. Nombreux koïlocytes, certains bi ou multinucléés. Quelques cellules dyskératosiques. Mitoses rares. Maturation préservée." |
| hyperplasie, pas de dysplasie | "Lésion hyperplasique malpighienne parakératosique. Maturation préservée. Absence de mitoses. Absence de dysplasie ou de signe histologique de malignité." |
| inflammatoire chronique bronchique | "Muqueuse bronchique tapissée par un revêtement épithélial respiratoire régulier sans atypie. Chorion siège d'un infiltrat lymphocytaire modérément abondant. Pas de granulome ni de prolifération tumorale." |
| ADK acineuse, TTF1+ | "Adénocarcinome infiltrant non mucineux, d'architecture acineuse, de phénotype TTF1+ en accord avec une origine pulmonaire." |

### 6.2 Formules de négation standardisées

| Expression orale | Formule standardisée dans le CR |
|---|---|
| pas d'infiltrant | Absence de carcinome infiltrant. |
| pas de méta | Absence de métastase ganglionnaire sur les X ganglions examinés. |
| pas de dysplasie | Absence de dysplasie ou de signe histologique de malignité. |
| pas de granulome | Il n'est pas observé de granulome ni de prolifération tumorale. |
| pas de cellule anormale | Il n'est pas observé de cellule anormale. |
| ALK négatif / ALK- | Absence de détection de la protéine ALK en immunohistochimie. |
| pas de mucosécrétion | Il n'est pas observé de mucosécrétion. |

---

## 7. Règles de Conclusion

- Toujours en **gras**
- Numérotée si plusieurs prélèvements/sites
- Termes nosologiques complets — aucune abréviation
- Phénotype IHC intégré si mentionné en dictée
- Absence de carcinome infiltrant mentionnée explicitement si diagnostic in situ

| Oral | Conclusion rédigée |
|---|---|
| IN3, P16+, pas d'infiltrant | **Lésion de néoplasie malpighienne intraépithéliale de haut grade (AIN3), de phénotype p16+. Absence de carcinome infiltrant.** |
| AIN1, HPV | **Aspect de lésion condylomateuse liée à HPV avec lésion malpighienne intraépithéliale de bas grade (AIN1).** |
| ADK, acineuse, TTF1+, PDL1 5%, ALK- | **Adénocarcinome infiltrant non mucineux, d'architecture acineuse, de phénotype TTF1+ en accord avec une origine pulmonaire. Expression de PD-L1 par 5% des cellules tumorales environ. Absence de détection de la protéine ALK en immunohistochimie.** |
| inflammatoire, LBA contamination PNN | **- Biopsies bronchiques : remaniements inflammatoires chroniques sans caractère histologique spécifique. - Liquide de LBA avec contamination bronchique, riche en polynucléaires neutrophiles.** |

---

## 8. Règles de Priorité et Ordre de Traitement

1. **Corrections phonétiques** — à appliquer EN PREMIER, avant toute interprétation
2. **Identification du type de prélèvement** → sélection du template
3. **Expansion des acronymes** selon dictionnaire
4. **Génération du tableau IHC** si ≥ 2 marqueurs détectés
5. **Rédaction de la conclusion** en termes nosologiques complets + phénotype IHC

> En cas d'ambiguïté entre deux termes phonétiquement proches, **le contexte anatomique prime** (ex. "bronchique" vs "branchique" : le contexte pulmonaire tranche).

---

## 9. Prompt Système Recommandé pour le LLM

```
Tu es un assistant spécialisé en anatomopathologie.
Tu reçois une transcription vocale brute d'un médecin pathologiste dictant un compte-rendu.
Ta tâche est de produire un compte-rendu anatomopathologique complet et bien formaté.

RÈGLES D'APPLICATION :
1. Applique le dictionnaire de corrections phonétiques avant toute interprétation.
2. Identifie le type de prélèvement et utilise le template correspondant.
3. Développe les acronymes selon le dictionnaire fourni.
4. Pour les marqueurs IHC (≥2), génère un tableau 3 colonnes avec phrase introductive standard.
5. Rédige la conclusion en gras avec les termes nosologiques complets.
6. Ne jamais inverser une négation médicale
   ("pas de cellule normale" = "absence de cellule anormale").
7. En cas de doute sur un terme acoustique, utilise le contexte anatomique pour trancher.
8. Conserve la structure :
   Titre souligné gras majuscules / Macroscopie / Microscopie / [IHC] / CONCLUSION.
9. Les renseignements cliniques (s'ils sont dictés) s'écrivent en italique.
10. Le texte des conclusions s'écrit toujours en gras.
```
