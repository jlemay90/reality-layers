import { AnalysisResult, WhatIfHypothesis } from '../types/reality';

export interface DemoObject {
  id: string;
  name: string;
  tagline: string;
  category: string;
  imageSvg: string;
  analysis: AnalysisResult;
  presetHypotheses: WhatIfHypothesis[];
}

export const DEMO_OBJECTS: DemoObject[] = [
  {
    id: 'demo-engine',
    name: '4-Stroke Overhead Camshaft (OHC) Engine',
    tagline: 'Single-cylinder 4-stroke internal combustion powerhead',
    category: 'mechanical',
    imageSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="%231a2333"/>
          <stop offset="100%" stop-color="%230b0e17"/>
        </radialGradient>
        <linearGradient id="metalCyl" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="%23334155"/>
          <stop offset="50%" stop-color="%2364748b"/>
          <stop offset="100%" stop-color="%231e293b"/>
        </linearGradient>
        <linearGradient id="pistonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="%2394a3b8"/>
          <stop offset="100%" stop-color="%23475569"/>
        </linearGradient>
        <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="%23ef4444"/>
          <stop offset="50%" stop-color="%23f59e0b"/>
          <stop offset="100%" stop-color="%2338bdf8"/>
        </linearGradient>
        <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="%2300f0ff" stroke-width="0.5" stroke-opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(%23bgGlow)"/>
      <rect width="800" height="600" fill="url(%23gridPattern)"/>

      <!-- Engine Outer Casing / Fins -->
      <g stroke="%2300f0ff" stroke-opacity="0.3" stroke-width="1.5">
        <line x1="260" y1="200" x2="220" y2="200"/>
        <line x1="260" y1="230" x2="210" y2="230"/>
        <line x1="260" y1="260" x2="215" y2="260"/>
        <line x1="260" y1="290" x2="220" y2="290"/>
        <line x1="260" y1="320" x2="225" y2="320"/>
        <line x1="540" y1="200" x2="580" y2="200"/>
        <line x1="540" y1="230" x2="590" y2="230"/>
        <line x1="540" y1="260" x2="585" y2="260"/>
        <line x1="540" y1="290" x2="580" y2="290"/>
        <line x1="540" y1="320" x2="575" y2="320"/>
      </g>

      <!-- Cylinder Block Outer Body -->
      <path d="M 280,120 L 520,120 L 520,380 L 560,480 L 240,480 L 280,380 Z" fill="url(%23metalCyl)" stroke="%2338bdf8" stroke-width="2"/>
      
      <!-- Cylinder Bore Interior -->
      <rect x="310" y="160" width="180" height="220" fill="%230f172a" stroke="%23475569" stroke-width="2"/>

      <!-- Spark Plug (Top Center) -->
      <g id="spark-plug-group">
        <rect x="388" y="70" width="24" height="65" fill="%23e2e8f0" stroke="%2300f0ff" stroke-width="1.5"/>
        <path d="M 384,105 L 416,105 L 416,115 L 384,115 Z" fill="%23f59e0b"/>
        <circle cx="400" cy="140" r="3" fill="%2338bdf8"/>
        <!-- Electric Spark Sparkle -->
        <path d="M 396,142 L 404,142 M 400,138 L 400,146" stroke="%2300f0ff" stroke-width="2"/>
      </g>

      <!-- Camshaft Assembly (Top Right / Left) -->
      <g id="camshaft-group">
        <circle cx="345" cy="100" r="18" fill="%23475569" stroke="%23a855f7" stroke-width="2"/>
        <path d="M 345,82 C 362,82 368,95 363,112 Z" fill="%2364748b"/>
        <circle cx="455" cy="100" r="18" fill="%23475569" stroke="%23a855f7" stroke-width="2"/>
        <path d="M 455,82 C 472,82 478,95 473,112 Z" fill="%2364748b"/>
      </g>

      <!-- Valves (Intake & Exhaust) -->
      <g id="valves-group">
        <!-- Intake Valve (Left) Open -->
        <line x1="345" y1="100" x2="345" y2="165" stroke="%2394a3b8" stroke-width="6"/>
        <path d="M 330,168 L 360,168 L 345,158 Z" fill="%2338bdf8"/>
        <!-- Exhaust Valve (Right) Closed -->
        <line x1="455" y1="100" x2="455" y2="160" stroke="%2394a3b8" stroke-width="6"/>
        <path d="M 440,160 L 470,160 L 455,150 Z" fill="%2394a3b8"/>
      </g>

      <!-- Combustion Flame Chamber -->
      <ellipse cx="400" cy="175" rx="70" ry="20" fill="url(%23fireGrad)" opacity="0.85"/>

      <!-- Piston Crown & Body -->
      <g id="piston-group">
        <rect x="315" y="210" width="170" height="85" rx="8" fill="url(%23pistonGrad)" stroke="%2300f0ff" stroke-width="2"/>
        <!-- Piston Compression Rings -->
        <line x1="315" y1="222" x2="485" y2="222" stroke="%230f172a" stroke-width="3"/>
        <line x1="315" y1="232" x2="485" y2="232" stroke="%230f172a" stroke-width="3"/>
        <!-- Gudgeon / Wrist Pin -->
        <circle cx="400" cy="255" r="14" fill="%231e293b" stroke="%2338bdf8" stroke-width="2"/>
      </g>

      <!-- Connecting Rod -->
      <g id="connecting-rod-group">
        <line x1="400" y1="255" x2="425" y2="420" stroke="%23cbd5e1" stroke-width="18" stroke-linecap="round"/>
        <line x1="400" y1="255" x2="425" y2="420" stroke="%23475569" stroke-width="8" stroke-linecap="round"/>
      </g>

      <!-- Crankshaft & Counterweight -->
      <g id="crankshaft-group">
        <circle cx="400" cy="440" r="60" fill="%231e293b" stroke="%2364748b" stroke-width="4"/>
        <path d="M 370,440 A 60 60 0 0 1 455,415 L 425,420 Z" fill="%23f59e0b" opacity="0.6"/>
        <!-- Crank Journal Pin -->
        <circle cx="425" cy="420" r="16" fill="%2300f0ff" stroke="%230f172a" stroke-width="3"/>
        <circle cx="400" cy="440" r="10" fill="%23ffffff"/>
        <!-- Rotation Vector Arrow -->
        <path d="M 470,440 A 70 70 0 0 1 410,510" fill="none" stroke="%2300f0ff" stroke-width="3" stroke-dasharray="6,4"/>
        <polygon points="410,515 400,505 415,500" fill="%2300f0ff"/>
      </g>

      <!-- Crankcase Oil Sump -->
      <path d="M 270,480 Q 400,570 530,480 Z" fill="%230f172a" stroke="%2300f0ff" stroke-opacity="0.4" stroke-width="2"/>
      <path d="M 310,510 Q 400,555 490,510" fill="none" stroke="%23f59e0b" stroke-width="4" stroke-opacity="0.7"/>

      <!-- Technical Telemetry Labels -->
      <text x="40" y="50" font-family="'JetBrains Mono', monospace" font-size="14" fill="%2300f0ff" letter-spacing="2">REALITY LAYER: KINEMATIC CROSS-SECTION</text>
      <text x="40" y="70" font-family="'JetBrains Mono', monospace" font-size="11" fill="%2394a3b8">CYCLE: OTTO 4-STROKE // BORE: 72mm // STROKE: 68mm</text>
    </svg>`,
    analysis: {
      id: 'analysis-engine',
      timestamp: Date.now() - 3600000,
      objectName: 'Overhead Cam (OHC) Single-Cylinder Internal Combustion Engine',
      confidence: 0.98,
      confidenceLevel: 'high',
      category: 'mechanical',
      summary: 'Cross-sectional mechanical assembly of a reciprocating four-stroke internal combustion engine showing cylinder head, valvetrain, combustion chamber, piston, connecting rod, and balanced crankshaft.',
      visibleObservations: [
        'Overhead spark plug with ceramic insulator located directly at combustion chamber apex',
        'Twin poppet valves (intake port and exhaust port) driven by eccentric lobe profiles',
        'Piston crown with two visible compression ring grooves fitted inside the cylinder liner',
        'Wrist pin (gudgeon pin) securing the upper connecting rod eye',
        'Heavy counterweighted crankshaft journal inside the oil sump base'
      ],
      inferredInternals: [
        'Timing chain or belt synchronizing crankshaft rotations (2:1 ratio) to the overhead camshaft',
        'Oil lubrication gallery pressurized by an internal trochoid oil pump',
        'Valve return springs maintaining poppet seating pressure against high combustion pressures'
      ],
      components: [
        {
          id: 'comp-spark',
          name: 'Spark Plug & Ignition Gap',
          category: 'power',
          position: { x: 50, y: 19 },
          purpose: 'Delivers high-voltage electrical discharge (15,000–30,000V) to initiate controlled deflagration of the compressed air-fuel charge.',
          howItWorks: {
            beginner: 'Acts like a miniature lightning bolt timed perfectly when the fuel and air are squished tight at the top of the cylinder, creating an explosion that pushes the engine down.',
            technical: 'High-voltage pulse arcs across the center and ground electrode gap (typically 0.7–1.0 mm), generating a localized plasma kernel that triggers an exothermic flame front at ~2,000 m/s.'
          },
          relationship: 'Coupled directly to ignition coil/ECU timing; fires precisely at 5°–20° Before Top Dead Center (BTDC) relative to crankshaft angle.',
          failureSymptoms: [
            'Carbon fouling causing spark misfires',
            'Electrode erosion causing widened gap and hard starting',
            'Cracked ceramic insulation leaking spark to cylinder head ground'
          ],
          materialOrSpec: 'Alumina ceramic insulator, nickel-alloy or iridium fine-wire tip',
          status: 'visible'
        },
        {
          id: 'comp-camshaft',
          name: 'Overhead Camshaft & Lobe',
          category: 'control',
          position: { x: 43, y: 16 },
          purpose: 'Translates rotational energy into precisely timed linear valve actuation.',
          howItWorks: {
            beginner: 'An oval-shaped spinning metal egg that bumps valves open and lets them snap closed at exact moments to let fresh air in and exhaust out.',
            technical: 'Eccentric lobe profile dictates valve lift duration, ramp acceleration, and overlap angle, maintaining volumetric efficiency across operating RPM bands.'
          },
          relationship: 'Driven at exactly 0.5× crankshaft speed via timing sprocket; directly depresses poppet valve buckets or rocker arms.',
          failureSymptoms: [
            'Lobe scuffing and wipeout due to inadequate zinc (ZDDP) additive in lubricating oil',
            'Ticking sound from excessive valve lash clearance'
          ],
          materialOrSpec: 'Chilled cast iron or case-hardened billet 8620 steel',
          status: 'visible'
        },
        {
          id: 'comp-valves',
          name: 'Poppet Valve System',
          category: 'fluid',
          position: { x: 43, y: 26 },
          purpose: 'Seals the combustion chamber gas-tight during compression and power strokes, opening selectively for intake and exhaust flow.',
          howItWorks: {
            beginner: 'Spring-loaded metal mushroom stoppers that drop down to allow air/fuel in, and pop back up tight against the ceiling so no pressure escapes.',
            technical: 'Operates with 45-degree ground seat angles to ensure hermetic boundary seal; cooled via contact with sintered valve seat inserts and valve guides.'
          },
          relationship: 'Synchronized with camshaft eccentric rotation; guided by bronze/cast iron guides pressed into the cylinder head.',
          failureSymptoms: [
            'Burnt exhaust valve from thermal overloading causing loss of cylinder compression',
            'Valve seat recession causing valve clearance to tighten to zero'
          ],
          materialOrSpec: 'Austenitic stainless steel (intake), Nimonic/Inconel superalloy (exhaust)',
          status: 'visible'
        },
        {
          id: 'comp-piston',
          name: 'Trunk Piston & Compression Rings',
          category: 'motion',
          position: { x: 50, y: 41 },
          purpose: 'Captures the rapidly expanding combustion gas pressure and transmits linear thrust down through the connecting rod.',
          howItWorks: {
            beginner: 'The sliding metal plug that takes the punch of the burning fuel and gets shoved downwards with tremendous force hundreds of times per second.',
            technical: 'Transforms chemical combustion enthalpy into mechanical work; ring pack (top compression, second scraper, oil control) establishes dynamic pressure boundary against cylinder wall.'
          },
          relationship: 'Slides axially within the cast-iron cylinder sleeve; transfers force to wrist pin (gudgeon pin).',
          failureSymptoms: [
            'Piston ring sticking from oil varnish causing blow-by and crankcase overpressurization',
            'Piston skirt galling due to cold-engine high-load seizure'
          ],
          materialOrSpec: 'Hypereutectic aluminum-silicon alloy (A390)',
          status: 'visible'
        },
        {
          id: 'comp-conrod',
          name: 'Forged Connecting Rod',
          category: 'motion',
          position: { x: 53, y: 55 },
          purpose: 'Converts reciprocating rectilinear piston motion into continuous angular rotation at the crankshaft.',
          howItWorks: {
            beginner: 'The strong metal arm connecting the sliding piston to the spinning wheel, like your shinbone pushing down on bicycle pedals.',
            technical: 'Undergoes complex alternating tensile, compressive column buckling, and bending stresses (whip) under peak cylinder pressure (~80 bar). Includes oil drilling for wrist pin splash lube.'
          },
          relationship: 'Small end articulates on wrist pin; big end clamps around crankshaft rod journal with split hydrodynamic journal bearings.',
          failureSymptoms: [
            'Spun rod bearing from oil starvation leading to catastrophic rod knock and seizure',
            'Rod buckling (hydrolock) caused by water ingestion into the intake'
          ],
          materialOrSpec: 'Forged 4340 chromoly steel or sintered fracture-split powder metal',
          status: 'visible'
        },
        {
          id: 'comp-crankshaft',
          name: 'Counterweighted Crankshaft',
          category: 'motion',
          position: { x: 52, y: 73 },
          purpose: 'Main output shaft converting piston strokes into rotational torque while neutralizing reciprocating inertia with counterweights.',
          howItWorks: {
            beginner: 'The heavy spinning crank at the bottom of the engine that sends power out to wheels or propellers, with heavy weights to keep it from vibrating apart.',
            technical: 'Features precisely calculated counterweight masses positioned 180° opposite crankpins to counterbalance 1st and 2nd order reciprocating inertial forces.'
          },
          relationship: 'Supported by main bearings in crankcase; drives flywheel, timing drive, and accessory belts.',
          failureSymptoms: [
            'Main bearing journal scoring from foreign particulate in engine oil',
            'Torsional fatigue cracking at rod journal fillets'
          ],
          materialOrSpec: 'Forged carbon steel (AISI 1045) or nodular ductile iron with induction-hardened journals',
          status: 'visible'
        },
        {
          id: 'comp-oilsump',
          name: 'Wet Sump & Lubrication Reservoir',
          category: 'fluid',
          position: { x: 50, y: 88 },
          purpose: 'Stores engine lubricant, collects return oil drains, and dissipates heat to surrounding airflow.',
          howItWorks: {
            beginner: 'The pan at the very bottom holding the pool of clean oil that coats every spinning part so metal never scratches metal.',
            technical: 'Includes internal anti-slosh baffles to prevent pump pickup cavitation during high-G lateral cornering; magnetic drain plug catches ferrous wear debris.'
          },
          relationship: 'Supplies submerged oil strainer pickup tube feeding high-pressure oil pump.',
          failureSymptoms: [
            'Puncture from road debris leading to rapid oil starvation',
            'Sludge accumulation from extended drain intervals or short trips'
          ],
          materialOrSpec: 'Pressed steel stamp or ribbed die-cast aluminum',
          status: 'visible'
        }
      ],
      mechanicalPrinciples: [
        {
          title: 'The Otto Thermodynamic Cycle',
          summary: 'Four distinct strokes (Intake, Compression, Power, Exhaust) complete one thermodynamic working cycle across 720 degrees of crankshaft rotation.',
          scientificLaw: 'First & Second Laws of Thermodynamics (Q_in = W_net + Q_out)',
          practicalApplication: 'Determines thermal efficiency, governed primarily by compression ratio (r): η = 1 - (1 / r^(γ-1)).'
        },
        {
          title: 'Slider-Crank Kinematics',
          summary: 'Translates 1-dimensional harmonic translation (piston) into constant angular velocity (flywheel) through an eccentric crank offset.',
          scientificLaw: "Newton's Second Law of Motion (F = m · a) and Conservation of Angular Momentum",
          practicalApplication: 'Generates significant secondary shaking forces because the piston travels faster in the upper half of its stroke than the lower half.'
        },
        {
          title: 'Hydrodynamic Film Lubrication',
          summary: 'Bearings float on a pressurized wedge of oil (5–20 microns thick) created purely by relative surface velocity.',
          scientificLaw: "Reynolds Lubrication Equation (Navier-Stokes fluid shear dynamics)",
          practicalApplication: 'Prevents metal-to-metal contact inside rod and main bearings as long as oil viscosity and journal velocity exceed the hydrodynamic threshold.'
        }
      ],
      interactions: [
        {
          from: 'Spark Plug & Ignition Gap',
          to: 'Trunk Piston & Compression Rings',
          type: 'thermal',
          description: 'Thermal deflagration creates peak pressure up to 80 bar pushing the piston downward on the power stroke.'
        },
        {
          from: 'Trunk Piston & Compression Rings',
          to: 'Forged Connecting Rod',
          type: 'mechanical',
          description: 'Piston wrist pin pushes the small end of the connecting rod downward with oscillating angular swing.'
        },
        {
          from: 'Forged Connecting Rod',
          to: 'Counterweighted Crankshaft',
          type: 'mechanical',
          description: 'Converts reciprocating push force into rotational torque along the 360-degree crank radius.'
        },
        {
          from: 'Counterweighted Crankshaft',
          to: 'Overhead Camshaft & Lobe',
          type: 'mechanical',
          description: 'Drives camshaft at half engine speed via timing belt/chain to ensure valves open exactly once every two revolutions.'
        }
      ],
      interestingFacts: [
        'At 6,000 RPM, the piston reverses direction 200 times per second, experiencing accelerations exceeding 1,000 Gs.',
        'The flame front burns across the combustion chamber at about 50 miles per hour, rather than instantaneous explosion.',
        'Approximately 70% of the energy in fuel is lost as waste heat through the cooling system and exhaust gases.'
      ],
      possibleImprovements: [
        'Variable Valve Timing (VVT) to optimize breathing across low and high RPM bands',
        'Direct Gasoline Injection (GDI) for precise stratified charge burning and cooler intake charges',
        'Cylinder deactivation or Atkinson-cycle late intake valve closing for elevated thermal efficiency'
      ],
      suggestedQuestions: [
        'Why does a four-stroke engine need two full crankshaft revolutions to fire once?',
        'What prevents the piston from scraping and welding itself to the cylinder wall?',
        'How does increasing the compression ratio improve fuel efficiency without using more fuel?',
        'What would happen if the timing chain snapped while the engine was running at high speed?'
      ],
      imageUrl: '' // Set to demo imageSvg
    },
    presetHypotheses: [
      {
        id: 'hyp-1',
        timestamp: Date.now() - 1800000,
        prompt: 'What if we replaced the camshaft and poppet valves with solenoid electromagnetic valve actuation (Camless Freevalve)?',
        targetComponent: 'Overhead Camshaft & Lobe',
        conceptTitle: 'Fully Variable Pneumatic-Hydraulic-Electromagnetic Valvetrain',
        overview: 'Eliminating the physical camshaft entirely allows computer-controlled pneumatic/solenoid actuators to open and close each intake and exhaust valve independently with infinite lift, duration, and timing control.',
        mechanicsExplanation: 'Mechanical cams enforce a fixed compromise between low-end idle stability and high-end peak power. A camless system decouples valve events from crankshaft position, permitting instant cylinder deactivation, Miller/Atkinson cycle switching on the fly, and zero pumping losses at part throttle.',
        tradeoffs: {
          pros: [
            '15-20% boost in overall thermal efficiency and low-RPM torque',
            'Eliminates camshaft, timing belt/gears, and mechanical friction losses',
            'Enables infinite variable valve lift without throttle plate restrictions'
          ],
          cons: [
            'Requires high-voltage (48V) electrical architecture and fast pneumatic solenoids',
            'Catastrophic engine collision risk if electronic control fails or desynchronizes',
            'Substantially higher component manufacturing cost and electronic complexity'
          ],
          efficiencyImpact: 'significantly higher',
          durabilityImpact: 'stable',
          complexityImpact: 'extreme'
        },
        schematicFlow: [
          { step: 1, title: 'Electronic Trigger', description: 'ECU reads optical crankshaft encoder and calculates optimal valve timing based on instantaneous manifold pressure and load.' },
          { step: 2, title: 'High-Speed Actuation', description: 'Pneumatic actuator pressurizes valve stem to snap open in under 2.5 milliseconds without spring bounce.' },
          { step: 3, title: 'Hydraulic Cushioning', description: 'Hydraulic dashpot decelerates valve face just before touchdown, preventing valve seat impact damage.' },
          { step: 4, title: 'Zero Pumping Loss', description: 'Intake valves stay open longer during cruise to self-throttle without a vacuum-inducing throttle plate.' }
        ],
        proposedExperiments: [
          {
            title: 'Dynamic Actuation Frequency Bench Test',
            procedure: 'Mount solenoid valve assembly on high-speed test rig with laser displacement interferometer; cycle through 0 to 120 Hz actuation frequencies.',
            expectedOutcome: 'Verify zero valve float and measure bounce amplitude under 0.05 mm at 7,000 virtual RPM.'
          },
          {
            title: 'Thermal Durability Chamber Cycling',
            procedure: 'Subject electronic solenoids to continuous 140°C oil bath temperatures under 50 million cycles.',
            expectedOutcome: 'Confirm electrical insulation resistance remains >10 Megaohms without coil shorting.'
          }
        ],
        speculativeNotice: 'Hypothetical conceptual exploration. Real implementation requires dedicated 48V power supply and deterministic microcontrollers.'
      },
      {
        id: 'hyp-2',
        timestamp: Date.now() - 900000,
        prompt: 'What if the cylinder and piston were manufactured from solid ceramic composites (Silicon Nitride) without liquid oil cooling (Adiabatic Engine)?',
        targetComponent: 'Trunk Piston & Compression Rings',
        conceptTitle: 'Low-Heat-Rejection (LHR) Adiabatic Ceramic Combustion Core',
        overview: 'Constructing the piston crown, cylinder liner, and cylinder head from structural ceramic (Si3N4 / Y-TZP) allows combustion chamber operating temperatures to reach 800°C–1,100°C without cooling jackets or liquid oil breakdown.',
        mechanicsExplanation: 'Over 30% of fuel energy is ordinarily carried away by engine coolant. Retaining this thermal energy inside the chamber produces extreme expansion pressure on the power stroke and delivers high-enthalpy exhaust gas suitable for secondary turbocompounding.',
        tradeoffs: {
          pros: [
            'Eliminates heavy radiator, water pump, coolant hoses, and cooling drag',
            'Theoretical thermal efficiency increase from 35% up to 48%',
            'Capable of burning heavy biofuels or multi-fuel without detonation knock'
          ],
          cons: [
            'Ceramics have low fracture toughness and fail catastrophically under shock loads',
            'High intake air pre-heating drops volumetric efficiency without extreme turbocharging',
            'Dry solid-film lubrication (e.g. graphite or diamond-like carbon) wears rapidly at high cycle counts'
          ],
          efficiencyImpact: 'significantly higher',
          durabilityImpact: 'critical risk',
          complexityImpact: 'extreme'
        },
        schematicFlow: [
          { step: 1, title: 'Ceramic Thermal Barrier', description: 'Combustion heat is contained within zero-coolant silicon nitride chamber walls.' },
          { step: 2, title: 'Superheated Expansion', description: 'High-temperature gas expands against ceramic piston crown with minimal wall heat loss.' },
          { step: 3, title: 'Turbocompound Recovery', description: 'Superheated exhaust gas enters a high-pressure secondary turbine geared directly back to the crank.' }
        ],
        proposedExperiments: [
          {
            title: 'Thermal Shock Quench Test',
            procedure: 'Heat silicon nitride piston coupons to 1,000°C in induction furnace, then rapidly quench with room temperature air blast.',
            expectedOutcome: 'Inspect via acoustic emission and dye penetrant for microscopic crack propagation.'
          }
        ],
        speculativeNotice: 'Hypothetical conceptual exploration. Historical adiabatic diesel prototypes proved viable in labs but suffered brittleness and dry lubrication limits.'
      }
    ]
  },
  {
    id: 'demo-watch',
    name: 'Mechanical Automatic Watch Movement',
    tagline: 'Precision mechanical escapement & oscillating balance spring',
    category: 'mechanical',
    imageSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <radialGradient id="watchPlate" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="%231e293b"/>
          <stop offset="85%" stop-color="%230f172a"/>
          <stop offset="100%" stop-color="%23020617"/>
        </radialGradient>
        <radialGradient id="brassGear" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="%23fde047"/>
          <stop offset="80%" stop-color="%23d97706"/>
          <stop offset="100%" stop-color="%2378350f"/>
        </radialGradient>
        <radialGradient id="rubyJewel" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="%23f43f5e"/>
          <stop offset="60%" stop-color="%23be123c"/>
          <stop offset="100%" stop-color="%234c0519"/>
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="%230b0e17"/>
      <!-- Watch Base Plate -->
      <circle cx="400" cy="300" r="260" fill="url(%23watchPlate)" stroke="%2338bdf8" stroke-width="2"/>
      <circle cx="400" cy="300" r="250" fill="none" stroke="%2300f0ff" stroke-width="0.5" stroke-dasharray="4,6"/>

      <!-- Mainspring Barrel (Top Left) -->
      <g id="mainspring-barrel">
        <circle cx="310" cy="220" r="80" fill="%231e293b" stroke="%23f59e0b" stroke-width="3"/>
        <path d="M 280,180 A 50 50 0 0 1 350,250" fill="none" stroke="%23f59e0b" stroke-width="4" stroke-opacity="0.6"/>
        <circle cx="310" cy="220" r="14" fill="url(%23rubyJewel)" stroke="%23fb7185" stroke-width="1.5"/>
      </g>

      <!-- Center Wheel & Pinion (Center) -->
      <g id="center-wheel">
        <circle cx="400" cy="300" r="65" fill="url(%23brassGear)" opacity="0.85" stroke="%23fef08a" stroke-width="2"/>
        <circle cx="400" cy="300" r="12" fill="url(%23rubyJewel)" stroke="%23fb7185" stroke-width="1.5"/>
      </g>

      <!-- Third and Fourth Seconds Wheel (Lower Center) -->
      <g id="fourth-wheel">
        <circle cx="460" cy="230" r="45" fill="url(%23brassGear)" opacity="0.8" stroke="%23fef08a" stroke-width="1.5"/>
        <circle cx="460" cy="230" r="8" fill="url(%23rubyJewel)"/>
      </g>

      <!-- Escapement Wheel (Right) -->
      <g id="escape-wheel">
        <circle cx="510" cy="330" r="32" fill="%230f172a" stroke="%2300f0ff" stroke-width="2"/>
        <!-- Star-pointed Escape Teeth -->
        <path d="M 510,298 L 515,310 L 525,302 L 520,315 L 535,315 L 524,325 L 538,335 L 522,338 L 530,352 L 515,346 L 512,362 L 505,348 L 492,358 L 498,344 L 482,342 L 495,332 L 485,320 L 498,318 L 492,305 L 504,312 Z" fill="%2300f0ff" opacity="0.8"/>
        <circle cx="510" cy="330" r="6" fill="url(%23rubyJewel)"/>
      </g>

      <!-- Swiss Lever Pallet Fork -->
      <g id="pallet-fork">
        <path d="M 470,360 L 510,345 L 485,385 Z" fill="%2394a3b8" stroke="%2338bdf8" stroke-width="1.5"/>
        <!-- Synthetic Ruby Pallet Stones -->
        <rect x="502" y="338" width="6" height="12" rx="2" fill="url(%23rubyJewel)" stroke="%23ffffff" stroke-width="0.5"/>
        <rect x="478" y="375" width="6" height="12" rx="2" fill="url(%23rubyJewel)" stroke="%23ffffff" stroke-width="0.5"/>
      </g>

      <!-- Glucydur Balance Wheel & Hairspring (Bottom Left) -->
      <g id="balance-wheel">
        <circle cx="360" cy="400" r="75" fill="none" stroke="%2300f0ff" stroke-width="4"/>
        <circle cx="360" cy="400" r="65" fill="none" stroke="%2338bdf8" stroke-width="1.5" stroke-dasharray="2,8"/>
        <!-- Balance Wheel Arms (3 spokes) -->
        <line x1="360" y1="400" x2="360" y2="325" stroke="%2300f0ff" stroke-width="3"/>
        <line x1="360" y1="400" x2="295" y2="437" stroke="%2300f0ff" stroke-width="3"/>
        <line x1="360" y1="400" x2="425" y2="437" stroke="%2300f0ff" stroke-width="3"/>
        <!-- Hairspring (Spiral) -->
        <path d="M 360,400 Q 365,395 370,400 Q 375,410 360,415 Q 345,415 345,395 Q 350,380 375,380 Q 390,385 390,410 Q 380,430 350,430" fill="none" stroke="%23a855f7" stroke-width="2"/>
        <!-- Center Incabloc Shock Ruby -->
        <circle cx="360" cy="400" r="16" fill="url(%23rubyJewel)" stroke="%23f43f5e" stroke-width="2"/>
        <path d="M 352,392 L 368,408 M 352,408 L 368,392" stroke="%23ffffff" stroke-width="1.5"/>
      </g>

      <!-- Semi-Transparent Winding Rotor Oscillating Weight (Top Half) -->
      <path d="M 180,240 A 240 240 0 0 1 620,240 L 400,300 Z" fill="%2364748b" fill-opacity="0.35" stroke="%23cbd5e1" stroke-width="2" stroke-dasharray="6,4"/>
      <circle cx="400" cy="300" r="30" fill="%230f172a" stroke="%23cbd5e1" stroke-width="2"/>

      <!-- Technical Callouts -->
      <text x="40" y="50" font-family="'JetBrains Mono', monospace" font-size="14" fill="%2300f0ff" letter-spacing="2">REALITY LAYER: HOROLOGICAL ESCAPEMENT</text>
      <text x="40" y="70" font-family="'JetBrains Mono', monospace" font-size="11" fill="%2394a3b8">FREQUENCY: 28,800 VPH (4Hz) // JEWELS: 25 SYNTHETIC CORUNDUM</text>
    </svg>`,
    analysis: {
      id: 'analysis-watch',
      timestamp: Date.now() - 7200000,
      objectName: 'Automatic Mechanical Watch Calibre Movement',
      confidence: 0.99,
      confidenceLevel: 'high',
      category: 'mechanical',
      summary: 'High-precision mechanical timekeeping movement featuring an automatic oscillating winding mass, gear train reduction, Swiss lever escapement, and temperature-compensating hairspring balance wheel oscillating at 4 Hz (28,800 vibrations per hour).',
      visibleObservations: [
        'Semi-circular tungsten oscillating rotor pivot at center with micro-ball bearing race',
        'Mainspring barrel drum enclosing high-tensile Nivaflex spring',
        'Contrasting gold-plated brass gear train with cycloidal tooth geometry',
        'Synthetic ruby (corundum) cap jewels with olive-drilled oil sinks',
        'Pallet fork with two ruby pallet stones locking and impulse-releasing escape wheel',
        'Glucydur balance wheel rim with hairspring regulator index'
      ],
      inferredInternals: [
        'Bridged click spring preventing mainspring reverse unwind during manual winding',
        'Nivarox balance spring alloy providing near-zero thermo-elastic coefficient',
        'Incabloc lyre-spring shock protection retaining the balance staff pivots'
      ],
      components: [
        {
          id: 'watch-mainspring',
          name: 'Mainspring Barrel',
          category: 'power',
          position: { x: 38, y: 36 },
          purpose: 'Acts as the potential energy reservoir, storing up to 48–70 hours of mechanical torque through a tightly coiled alloy ribbon.',
          howItWorks: {
            beginner: 'A tightly wound metal ribbon inside a drum that acts like the watch\'s battery, slowly unwinding to power the gears.',
            technical: 'Spiraled Nivaflex ribbon releases stored elastic potential energy via outer barrel teeth to the center wheel pinion under governed tension.'
          },
          relationship: 'Wound either by the automatic rotor or manually through the winding stem and ratchet wheel.',
          failureSymptoms: [
            'Broken mainspring causing complete absence of power reserve',
            'Slipping bridle slipping prematurely causing low runtime'
          ],
          materialOrSpec: 'Nivaflex non-magnetic cobalt-nickel-chromium alloy',
          status: 'visible'
        },
        {
          id: 'watch-geartrain',
          name: 'Going Train (Center, Third, Fourth Wheel)',
          category: 'motion',
          position: { x: 50, y: 50 },
          purpose: 'Steps up rotational speed from the slow mainspring (several turns per day) to the rapid seconds wheel (1 RPM).',
          howItWorks: {
            beginner: 'A chain of tiny interlocking brass gears that speed up rotation so hands move smoothly at seconds, minutes, and hours.',
            technical: 'Employs cycloidal and circular-arc tooth profiles to minimize friction, ensuring continuous gear ratio step-up to drive hour, minute, and seconds pivots.'
          },
          relationship: 'Interposed between mainspring barrel and escape wheel pinion.',
          failureSymptoms: [
            'Pivot wear leading to gear train jamming or high frictional loss',
            'Lint or dust trapped between microscopic teeth'
          ],
          materialOrSpec: 'CuZn39Pb2 watchmakers brass with hardened steel pinions',
          status: 'visible'
        },
        {
          id: 'watch-escapement',
          name: 'Swiss Lever Escapement & Escape Wheel',
          category: 'control',
          position: { x: 64, y: 55 },
          purpose: 'Converts continuous rotational gear energy into discrete periodic pulses, meting out fractions of a second.',
          howItWorks: {
            beginner: 'The tick-tock heart that locks the gears, lets one tooth slip through at a time, and gives the balance wheel a tiny kick on every beat.',
            technical: 'The club-toothed escape wheel impulses the ruby pallet stones; impulse face angle and lock angle ensure deadbeat release without recoil.'
          },
          relationship: 'Receives torque from 4th wheel; impulses the balance wheel roller jewel on alternating swings.',
          failureSymptoms: [
            'Dried lubrication on pallet stone faces causing low balance amplitude',
            'Chipped ruby pallet stone causing erratic stopping'
          ],
          materialOrSpec: 'Hardened steel escape wheel with synthetic monocrystalline ruby pallet stones',
          status: 'visible'
        },
        {
          id: 'watch-balance',
          name: 'Balance Wheel & Hairspring (Oscillator)',
          category: 'control',
          position: { x: 45, y: 67 },
          purpose: 'Serves as the resonant isochronous time standard, swinging back and forth at exactly 4 Hz (28,800 beats per hour).',
          howItWorks: {
            beginner: 'A tiny spinning flywheel that wobbles back and forth on a hair-thin coil spring, dividing time into 8 micro-fractions every second.',
            technical: 'Natural oscillation frequency determined by moment of inertia (I) and hairspring spring constant (k): f = (1 / 2π) · √(k / I).'
          },
          relationship: 'Reverses motion at peak amplitude (270°–310°) and kicks pallet fork back across center.',
          failureSymptoms: [
            'Magnetization of hairspring coils causing extreme fast running (+2 hours/day)',
            'Bent balance staff pivot following a drop on hard floor'
          ],
          materialOrSpec: 'Glucydur (copper-beryllium) rim with Nivarox-1 or silicon (Silicium) hairspring',
          status: 'visible'
        },
        {
          id: 'watch-jewels',
          name: 'Synthetic Ruby Jewel Bearings',
          category: 'structural',
          position: { x: 57, y: 38 },
          purpose: 'Provides ultra-low friction, high-hardness pivot bearings for delicate high-speed gear arbor pivots.',
          howItWorks: {
            beginner: 'Lab-grown red gems polished slicker than glass so metal pins spin smoothly for years without wearing holes in the metal plate.',
            technical: 'Synthetic corundum (Al2O3, Mohs 9 hardness) with surface roughness Ra < 0.02 µm, retaining microscopic droplets of specialized synthetic watch oil.'
          },
          relationship: 'Friction-fit into plate and bridge chatons, housing gear arbors and balance staff.',
          failureSymptoms: [
            'Cracked jewel hole causing arbor tilt and gear misalignment',
            'Dry or gummed lubricant leading to rapid pivot scoring'
          ],
          materialOrSpec: 'Synthetic Corundum (Single-crystal Aluminum Oxide)',
          status: 'visible'
        }
      ],
      mechanicalPrinciples: [
        {
          title: 'Isochronism of the Torsion Pendulum',
          summary: 'A balance wheel completes each oscillation in the exact same duration regardless of whether the swing angle is large (300°) or small (220°).',
          scientificLaw: 'Simple Harmonic Motion (Hooke’s Law for torsional deflection: τ = -κθ)',
          practicalApplication: 'Allows the watch to keep identical time whether fully wound in the morning or nearly depleted at night.'
        },
        {
          title: 'Thermoelastic Compensation',
          summary: 'Most metals soften and lose spring stiffness when warmed. Specially alloyed hairsprings maintain identical modulus across -20°C to +50°C.',
          scientificLaw: "Thermoelastic Coefficient of Elastic Modulus (dE/dT ≈ 0)",
          practicalApplication: 'Prevents the watch from losing minutes per day in hot summer weather or gaining time in freezing winter.'
        }
      ],
      interactions: [
        {
          from: 'Mainspring Barrel',
          to: 'Going Train (Center, Third, Fourth Wheel)',
          type: 'mechanical',
          description: 'Supplies continuous high torque to center pinion, stepped up ~3,600:1 through fourth wheel.'
        },
        {
          from: 'Swiss Lever Escapement & Escape Wheel',
          to: 'Balance Wheel & Hairspring (Oscillator)',
          type: 'mechanical',
          description: 'Delivers a microscopic mechanical impulse kick to the roller jewel during each center passage to sustain oscillation against friction.'
        }
      ],
      interestingFacts: [
        'A mechanical watch balance wheel travels over 10,000 miles in rotational oscillations over the course of a single year.',
        'Synthetic rubies used in watches are chemically identical to natural mined gemstones, created via Verneuil flame-fusion process.',
        'A single drop of specialized watch oil (less than 1/1000th of a milliliter) lubricates all 25 bearing jewels for 5 years.'
      ],
      possibleImprovements: [
        'Single-crystal silicon (Silicium) hairspring and escapement wheel for zero magnetic susceptibility and lube-free operation',
        'Titanium balance wheel with peripheral platinum regulating screws for maximum moment of inertia with minimal total mass',
        'Co-Axial escapement architecture to replace sliding friction with radial tangential impulse'
      ],
      suggestedQuestions: [
        'How does a self-winding rotor wind the watch in both clockwise and counter-clockwise directions?',
        'Why does magnetism make a mechanical watch run minutes or hours fast every day?',
        'What prevents the watch from over-winding and snapping the mainspring when worn continuously?',
        'How does an Incabloc spring protect delicate balance pivots when you accidentally drop your watch?'
      ],
      imageUrl: ''
    },
    presetHypotheses: [
      {
        id: 'hyp-watch-1',
        timestamp: Date.now() - 3600000,
        prompt: 'What if we replaced the Swiss lever escapement with a Monolithic Silicon Oscillator running at 100 Hz (Genequand / Zenith Defy Lab concept)?',
        targetComponent: 'Swiss Lever Escapement & Escape Wheel',
        conceptTitle: 'Monolithic Compliant Silicon Resonator',
        overview: 'Replaces the entire 30-part balance assembly, hairspring, and pallet fork with a single micro-etched wafer of single-crystal silicon utilizing compliant flexure hinges.',
        mechanicsExplanation: 'Silicon flexures undergo frictionless elastic bending without pivot friction or oil requirements. Operating at 100 Hz (720,000 VPH) increases timing precision tenfold while drastically reducing susceptibility to gravity positional variance.',
        tradeoffs: {
          pros: [
            'Completely impervious to magnetic fields and temperature shifts',
            'Eliminates all lubricants and mechanical pivot wear entirely',
            'Superb chronometric accuracy: under ±0.3 seconds per day'
          ],
          cons: [
            'Extreme 100 Hz frequency depletes mainspring reserve faster unless power is stepped down',
            'Silicon wafers cannot be repaired or trued by traditional watchmakers; requires replacement',
            'Requires deep reactive-ion etching (DRIE) semiconductor cleanroom equipment to manufacture'
          ],
          efficiencyImpact: 'significantly higher',
          durabilityImpact: 'increased',
          complexityImpact: 'extreme'
        },
        schematicFlow: [
          { step: 1, title: 'Compliant Flexure Deflection', description: 'Silicon micro-beams flex elastically through ±6 degrees of amplitude without pivot journals.' },
          { step: 2, title: 'Direct Gear Locking', description: 'Integrated silicon anchors arrest escape wheel teeth with near-zero acoustic impulse sound.' },
          { step: 3, title: 'Constant Modulus Response', description: 'Thermal oxide surface coating cancels silicon thermo-elastic drift across operating temperatures.' }
        ],
        proposedExperiments: [
          {
            title: 'Positional Isochronism Deviation Test',
            procedure: 'Place watch movement on computerized Witschi multi-axis microphone timer across all 6 spatial positions (Dial Up, Dial Down, Crown Left, Crown Right, etc.).',
            expectedOutcome: 'Confirm delta variation between positions remains under 1.0 second/day.'
          }
        ],
        speculativeNotice: 'Hypothetical conceptual exploration based on actual Horological research (CSEM & Zenith Lab flexure prototypes).'
      }
    ]
  }
];

// Pre-fill image data with SVGs
DEMO_OBJECTS.forEach(demo => {
  demo.analysis.imageUrl = demo.imageSvg;
});
