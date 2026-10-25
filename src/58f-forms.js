/* Online forms: the town's paper forms as step-by-step web forms.
   One spec per form in FORMS; one engine renders them all. Wording, fees
   and attachments come from the PDF or Word file at each spec's source
   url. Anything the town still has to confirm is in [brackets]. */

function fmT(en, es) { return { en: en, es: es }; }

var FM_YESNO = [['yes', fmT('Yes', 'Sí')], ['no', fmT('No', 'No')]];
var FM_STATES = ['VA', 'NC', 'MD', 'WV', 'TN', 'KY', 'DC', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'LA', 'ME', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TX', 'UT', 'VT', 'WA', 'WI', 'WY'];

function fmJob(n) {
  var sfx = String(n);
  var en = function (s) { return s + ' (job ' + n + ')'; };
  var es = function (s) { return s + ' (empleo ' + n + ')'; };
  return [
    { name: 'job' + sfx + '_title', label: fmT(en('Job title'), es('Puesto')), required: n === 1 },
    { name: 'job' + sfx + '_company', label: fmT(en('Company name'), es('Nombre de la empresa')), required: n === 1 },
    { name: 'job' + sfx + '_start', label: fmT(en('Start date'), es('Fecha de inicio')), type: 'text', hint: fmT('Month, day and year, for example 03/15/2022.', 'Mes, día y año, por ejemplo 03/15/2022.') },
    { name: 'job' + sfx + '_end', label: fmT(en('End date'), es('Fecha de fin')), type: 'text', hint: fmT('Leave blank if you still work there.', 'Déjelo en blanco si todavía trabaja allí.') },
    { name: 'job' + sfx + '_super', label: fmT(en('Supervisor’s name'), es('Nombre del supervisor')) },
    { name: 'job' + sfx + '_phone', label: fmT(en('Phone number'), es('Teléfono')), type: 'tel' },
    { name: 'job' + sfx + '_city', label: fmT(en('City'), es('Ciudad')) },
    { name: 'job' + sfx + '_state', label: fmT(en('State'), es('Estado')), type: 'state' },
    { name: 'job' + sfx + '_zip', label: fmT(en('Zip'), es('Código postal')), type: 'zip' },
    { name: 'job' + sfx + '_duties', label: fmT(en('Duties'), es('Funciones')), type: 'textarea', span: true },
    { name: 'job' + sfx + '_reason', label: fmT(en('Reason for leaving'), es('Motivo de salida')), span: true },
    { name: 'job' + sfx + '_pay_start', label: fmT(en('Starting salary'), es('Salario inicial')), type: 'money' },
    { name: 'job' + sfx + '_pay_end', label: fmT(en('Ending salary'), es('Salario final')), type: 'money' }
  ];
}

function fmSchool(n, word) {
  return [
    { name: 'school' + n + '_name', label: fmT(word.en + ': school name', word.es + ': nombre de la escuela') },
    { name: 'school' + n + '_degree', label: fmT(word.en + ': degree or certificate', word.es + ': título o certificado') },
    { name: 'school' + n + '_where', label: fmT(word.en + ': address, city, state', word.es + ': dirección, ciudad, estado'), span: true }
  ];
}

function fmReference(n) {
  var en = 'Reference ' + n, es = 'Referencia ' + n;
  return [
    { name: 'ref' + n + '_name', label: fmT(en + ': full name', es + ': nombre completo'), required: n === 1 },
    { name: 'ref' + n + '_phone', label: fmT(en + ': phone', es + ': teléfono'), type: 'tel', required: n === 1 },
    { name: 'ref' + n + '_where', label: fmT(en + ': address, city, state', es + ': dirección, ciudad, estado') },
    { name: 'ref' + n + '_rel', label: fmT(en + ': relationship', es + ': relación'), required: n === 1 }
  ];
}

var FORMS = [
  {
    id: 'zoning-permit',
    title: fmT('Zoning Permit Application', 'Solicitud de permiso de zonificación'),
    source: 'https://keysvilleva.gov/wp-content/uploads/2024/09/ZONING-PERMIT-APPLICATION.pdf',
    dept: 'manager', cat: 'other', minutes: 10,
    purpose: fmT('Before you build, add on, repair or tear down a building in town.', 'Antes de construir, ampliar, reparar o demoler una edificación en el pueblo.'),
    intro: fmT('Property owners and contractors use this form to apply for a zoning permit for the construction, repair or improvement of a building or structure within the Town of Keysville. The Zoning Administrator checks the application against the Keysville Zoning Ordinance and marks it approved or not approved. The paper form keeps a space for that decision; online you will see it under your reference number.', 'Los propietarios y contratistas usan este formulario para solicitar un permiso de zonificación para la construcción, reparación o mejora de una edificación o estructura dentro del Town of Keysville. El Administrador de Zonificación revisa la solicitud según la Ordenanza de Zonificación de Keysville y la marca como aprobada o no aprobada. En el formulario de papel hay un espacio para esa decisión; en línea la verá bajo su número de referencia.'),
    fee: fmT('$35.00, required with the application. Pay at Town Hall or by mail; the online form does not take payment.', '$35.00, obligatorios con la solicitud. Se paga en la Alcaldía o por correo; el formulario en línea no cobra.'),
    attachments: [fmT('Two drawings of the plot plan showing the lot dimensions, building location on the lot, building dimensions and building plans. The town keeps one copy and returns the other.', 'Dos dibujos del plano del lote que muestren las dimensiones del lote, la ubicación de la edificación en el lote, las dimensiones de la edificación y los planos. El pueblo se queda con una copia y devuelve la otra.')],
    signText: fmT('I hereby certify that the above is true and correct to the best of my knowledge and belief.', 'Certifico que lo anterior es verdadero y correcto según mi leal saber y entender.'),
    steps: [
      { title: fmT('Owner and lot', 'Propietario y lote'), fields: [
        { name: 'owner', label: fmT('Owner’s name', 'Nombre del propietario'), required: true, role: 'name', auto: 'name' },
        { name: 'phone', label: fmT('Telephone', 'Teléfono'), type: 'tel', required: true, role: 'contact', auto: 'tel' },
        { name: 'email', label: fmT('Email', 'Correo electrónico'), type: 'email', role: 'contact', auto: 'email', hint: fmT('Not on the paper form. Give one if you want updates by email.', 'No está en el formulario de papel. Indíquelo si quiere recibir avisos por correo electrónico.') },
        { name: 'address', label: fmT('Address of the property', 'Dirección de la propiedad'), type: 'address', required: true, role: 'where', span: true },
        { name: 'lot', label: fmT('Size and location of lot', 'Tamaño y ubicación del lote'), required: true, span: true },
        { name: 'zoning', label: fmT('Zoning of lot', 'Zonificación del lote'), hint: fmT('If you are not sure, leave it blank; the office looks it up on the zoning map.', 'Si no está seguro, déjelo en blanco; la oficina lo consulta en el mapa de zonificación.') }
      ] },
      { title: fmT('The work', 'La obra'), fields: [
        { name: 'kind', label: fmT('Application for', 'Tipo de solicitud'), type: 'radio', required: true, options: [['new', fmT('New construction', 'Construcción nueva')], ['improvement', fmT('Improvement', 'Mejora')], ['demolition', fmT('Demolition', 'Demolición')], ['other', fmT('Other', 'Otro')]] },
        { name: 'kind_other', label: fmT('Other: describe', 'Otro: describa'), when: { name: 'kind', value: 'other' }, required: true, span: true },
        { name: 'use', label: fmT('Building will be used for', 'La edificación se usará para'), required: true, span: true },
        { name: 'value', label: fmT('Contract price or value', 'Precio del contrato o valor'), type: 'money', required: true },
        { name: 'contractor', label: fmT('Contractor’s name', 'Nombre del contratista'), hint: fmT('Leave blank if you are doing the work yourself.', 'Déjelo en blanco si usted mismo hará la obra.') },
        { name: 'contractor_address', label: fmT('Contractor’s address', 'Dirección del contratista'), type: 'address', span: true },
        { name: 'contractor_phone', label: fmT('Contractor’s telephone', 'Teléfono del contratista'), type: 'tel' }
      ] },
      { title: fmT('Construction details', 'Detalles de construcción'), fields: [
        { name: 'exterior', label: fmT('Construction: exterior', 'Construcción: exterior'), hint: fmT('Materials, for example brick veneer or vinyl siding.', 'Materiales, por ejemplo ladrillo o revestimiento de vinilo.') },
        { name: 'interior', label: fmT('Construction: interior', 'Construcción: interior') },
        { name: 'roofing', label: fmT('Roofing', 'Techo') },
        { name: 'heating', label: fmT('Heating', 'Calefacción') },
        { name: 'bathrooms', label: fmT('Number of bathrooms', 'Número de baños'), type: 'number' },
        { name: 'rooms', label: fmT('Number of rooms', 'Número de habitaciones'), type: 'number' },
        { name: 'stories', label: fmT('Number of stories', 'Número de pisos'), type: 'number' },
        { name: 'foundation', label: fmT('Foundation type', 'Tipo de cimentación') },
        { name: 'floor', label: fmT('Floor type', 'Tipo de piso') },
        { name: 'porches', label: fmT('Number of porches', 'Número de porches'), type: 'number' },
        { name: 'size', label: fmT('Building size (length × width, feet)', 'Tamaño de la edificación (largo × ancho, en pies)'), hint: fmT('For example 40 × 28.', 'Por ejemplo 40 × 28.') },
        { name: 'sqft', label: fmT('Building square feet', 'Pies cuadrados de la edificación'), type: 'number' },
        { name: 'garage', label: fmT('Garage or carport (length × width, feet)', 'Garaje o cochera (largo × ancho, en pies)') },
        { name: 'garage_sqft', label: fmT('Garage or carport square feet', 'Pies cuadrados del garaje o cochera'), type: 'number' },
        { name: 'plans', label: fmT('Plot plan and building plans', 'Plano del lote y planos de la edificación'), type: 'file', hint: fmT('Two drawings are required. Name the files here and bring or mail the paper copies.', 'Se requieren dos dibujos. Indique aquí los archivos y lleve o envíe por correo las copias en papel.') }
      ] }
    ]
  },
  {
    id: 'business-license',
    title: fmT('2026 Business License Application', 'Solicitud de licencia comercial 2026'),
    source: 'https://keysvilleva.gov/wp-content/uploads/2026/08/2026-BUSINESS-LICENSE-APPLICATION.pdf',
    dept: 'clerk', cat: 'business', minutes: 8,
    purpose: fmT('Yearly license for anyone doing business in town. Due by March 1.', 'Licencia anual para quien hace negocios en el pueblo. Vence el 1 de marzo.'),
    intro: fmT('Every business in the Town of Keysville buys a license each year. The license fee is based on gross receipts or sales from January 1, 2025 through December 31, 2025. Fill in the type of business and the gross receipts that apply; the form works out the tax due the same way the paper form shows. The application goes to the Treasurer [confirm: reached through the Town Clerk’s office], who may ask for a tax form showing proof of gross receipts or sales.', 'Todo negocio en el Town of Keysville compra una licencia cada año. La tarifa se basa en los ingresos brutos o ventas del 1 de enero de 2025 al 31 de diciembre de 2025. Indique el tipo de negocio y los ingresos brutos correspondientes; el formulario calcula el impuesto igual que el formulario de papel. La solicitud llega al Tesorero [confirmar: a través de la oficina de la Secretaría Municipal], quien puede pedir un formulario de impuestos que compruebe los ingresos brutos o ventas.'),
    fee: fmT('Retail merchant: $0.04 per $100 or $30, whichever is greater. Wholesale merchant: $0.02 per $100 or $30, whichever is greater. Personal service, repair service, contractor, financial, real estate and professional service: $0.04 per $100 or $30, whichever is greater. Peddler: $50.00 per year. Pay the Treasurer at Town Hall or by mail to P.O. Box 42, Keysville, VA 23947.', 'Comerciante minorista: $0.04 por cada $100 o $30, lo que sea mayor. Comerciante mayorista: $0.02 por cada $100 o $30, lo que sea mayor. Servicios personales, de reparación, contratistas, servicios financieros, inmobiliarios y profesionales: $0.04 por cada $100 o $30, lo que sea mayor. Vendedor ambulante: $50.00 al año. Se paga al Tesorero en la Alcaldía o por correo a P.O. Box 42, Keysville, VA 23947.'),
    deadline: fmT('All licenses are due and payable by March 1 of each year. Anyone doing business without a license after March 1, 2026 pays a penalty of 10% of the license tax before the license is issued.', 'Todas las licencias vencen y se pagan a más tardar el 1 de marzo de cada año. Quien haga negocios sin licencia después del 1 de marzo de 2026 paga una multa del 10% del impuesto de licencia antes de que se emita la licencia.'),
    attachments: [fmT('A tax form showing proof of gross receipts or sales may be required.', 'Puede requerirse un formulario de impuestos que compruebe los ingresos brutos o ventas.')],
    sensitive: fmT('Your gross receipts figure is a tax record. It is seen by the Treasurer’s staff and is not posted anywhere. Do not include your Social Security or bank account numbers; the form does not ask for them.', 'La cifra de ingresos brutos es un registro fiscal. La ve el personal de la Tesorería y no se publica. No incluya su número de Seguro Social ni de cuenta bancaria; el formulario no los pide.'),
    signText: fmT('Oath: I, the undersigned applicant, do hereby swear (or affirm) that the foregoing figures and statements are true and correct to the best of my knowledge and belief. The Town is authorized to summon my records for investigation as to the accuracy of this report.', 'Juramento: Yo, el solicitante abajo firmante, juro (o afirmo) que las cifras y declaraciones anteriores son verdaderas y correctas según mi leal saber y entender. El pueblo está autorizado a requerir mis registros para investigar la exactitud de este informe.'),
    steps: [
      { title: fmT('Your business', 'Su negocio'), fields: [
        { name: 'business', label: fmT('Business name', 'Nombre del negocio'), required: true, span: true, auto: 'organization' },
        { name: 'mailing', label: fmT('Complete mailing address', 'Dirección postal completa'), type: 'address', required: true, span: true },
        { name: 'physical', label: fmT('Complete physical address', 'Dirección física completa'), type: 'address', required: true, role: 'where', span: true },
        { name: 'phone', label: fmT('Phone', 'Teléfono'), type: 'tel', required: true, role: 'contact', auto: 'tel' },
        { name: 'email', label: fmT('Email', 'Correo electrónico'), type: 'email', role: 'contact', auto: 'email' }
      ] },
      { title: fmT('Type of business and gross receipts', 'Tipo de negocio e ingresos brutos'), fields: [
        { name: 'type', label: fmT('Type of business', 'Tipo de negocio'), type: 'radio', required: true, options: [
          ['retail', fmT('Retail merchant: $0.04 per $100 or $30, whichever is greater', 'Comerciante minorista: $0.04 por $100 o $30, lo que sea mayor')],
          ['wholesale', fmT('Wholesale merchant: $0.02 per $100 or $30, whichever is greater', 'Comerciante mayorista: $0.02 por $100 o $30, lo que sea mayor')],
          ['service', fmT('Personal service or repair service: $0.04 per $100 or $30, whichever is greater', 'Servicio personal o de reparación: $0.04 por $100 o $30, lo que sea mayor')],
          ['contractor', fmT('Contractor: $0.04 per $100 or $30, whichever is greater', 'Contratista: $0.04 por $100 o $30, lo que sea mayor')],
          ['professional', fmT('Financial, real estate or professional service: $0.04 per $100 or $30, whichever is greater', 'Servicio financiero, inmobiliario o profesional: $0.04 por $100 o $30, lo que sea mayor')],
          ['peddler', fmT('Peddler: $50.00 per year', 'Vendedor ambulante: $50.00 al año')]
        ] },
        { name: 'gross', label: fmT('Gross receipts or sales, January 1 to December 31, 2025', 'Ingresos brutos o ventas, del 1 de enero al 31 de diciembre de 2025'), type: 'money', required: true, hint: fmT('Example from the form: $50,000 ÷ $100 = 500 × $0.04 = $20.00, so the license due is the $30 minimum. $100,000 ÷ $100 = 1,000 × $0.04 = $40.00 due.', 'Ejemplo del formulario: $50,000 ÷ $100 = 500 × $0.04 = $20.00, así que se debe el mínimo de $30. $100,000 ÷ $100 = 1,000 × $0.04 = $40.00.') },
        { name: 'proof', label: fmT('Tax form showing gross receipts (if you have it handy)', 'Formulario de impuestos con los ingresos brutos (si lo tiene a mano)'), type: 'file' }
      ] }
    ],
    computed: function (a) {
      var gross = fmNum(a.gross);
      var rate = { retail: 0.04, wholesale: 0.02, service: 0.04, contractor: 0.04, professional: 0.04 }[a.type];
      var due = a.type === 'peddler' ? 50 : (rate && gross >= 0 ? Math.max(30, Math.round(gross / 100 * rate * 100) / 100) : null);
      if (due === null) return [];
      return [{ label: fmT('Tax due (worked out from the rate table; the Treasurer confirms it)', 'Impuesto a pagar (calculado con la tabla de tarifas; el Tesorero lo confirma)'), value: '$' + due.toFixed(2) }];
    }
  },
  {
    id: 'water-service',
    title: fmT('Application for Water and Sewer Service', 'Solicitud de servicio de agua y alcantarillado'),
    source: 'https://keysvilleva.gov/wp-content/uploads/2026/08/WATER-SEWER-APPLICATION-06262026.docx',
    dept: 'billing', cat: 'billing', minutes: 6,
    purpose: fmT('Open a water and sewer account in your name at a Keysville address.', 'Abrir una cuenta de agua y alcantarillado a su nombre en una dirección de Keysville.'),
    intro: fmT('Use this form to put water and sewer service in your name. By applying you agree to abide by the billing policy of the Town of Keysville and to pay for all charges for water and sewer consumption. Water Billing sets up the account; service is connected after the deposit and connection fee are paid at Town Hall.', 'Use este formulario para poner el servicio de agua y alcantarillado a su nombre. Al solicitarlo, acepta cumplir la política de facturación del Town of Keysville y pagar todos los cargos por consumo de agua y alcantarillado. Facturación de Agua abre la cuenta; el servicio se conecta después de pagar el depósito y la tarifa de conexión en la Alcaldía.'),
    fee: fmT('A deposit of $100.00 is required upon application for service, and a $35.00 connection fee is required before the service is connected in your name ($135.00 in all). Paid at Town Hall; the online form does not take payment.', 'Se requiere un depósito de $100.00 al solicitar el servicio y una tarifa de conexión de $35.00 antes de conectar el servicio a su nombre ($135.00 en total). Se paga en la Alcaldía; el formulario en línea no cobra.'),
    attachments: [fmT('Photo ID when you come to pay the deposit. [Confirm what the office asks to see.]', 'Identificación con foto cuando venga a pagar el depósito. [Confirmar qué pide ver la oficina.]')],
    sensitive: fmT('The paper form asks for your full Social Security number. Online we take at most the last four digits, and only if you choose to give them. If the town still needs the full number, it is given in person at Town Hall, never through this website. [Confirm whether the town still requires it and under what written notice.]', 'El formulario de papel pide su número de Seguro Social completo. En línea tomamos como máximo los últimos cuatro dígitos, y solo si usted decide darlos. Si el pueblo aún necesita el número completo, se entrega en persona en la Alcaldía, nunca por este sitio web. [Confirmar si el pueblo todavía lo exige y con qué aviso por escrito.]'),
    signText: fmT('I agree to abide by the billing policy of the Town of Keysville and to pay for all charges for water and sewer consumption. I understand that a deposit of $100.00 will be required upon application for service, and a $35.00 connection fee is required prior to having this water/sewer service connected in my name.', 'Acepto cumplir la política de facturación del Town of Keysville y pagar todos los cargos por consumo de agua y alcantarillado. Entiendo que se requerirá un depósito de $100.00 al solicitar el servicio y una tarifa de conexión de $35.00 antes de que el servicio de agua y alcantarillado se conecte a mi nombre.'),
    steps: [
      { title: fmT('Who and where', 'Quién y dónde'), fields: [
        { name: 'names', label: fmT('Name(s) on the account', 'Nombre(s) en la cuenta'), required: true, role: 'name', span: true, auto: 'name' },
        { name: 'service', label: fmT('Service address', 'Dirección del servicio'), type: 'address', required: true, role: 'where', span: true },
        { name: 'mailing', label: fmT('Mailing address', 'Dirección postal'), type: 'address', required: true, span: true, hint: fmT('Where the bill should go, if different.', 'Adónde debe llegar la factura, si es distinta.') },
        { name: 'phone', label: fmT('Telephone', 'Teléfono'), type: 'tel', required: true, role: 'contact', auto: 'tel' },
        { name: 'email', label: fmT('Email address', 'Correo electrónico'), type: 'email', role: 'contact', auto: 'email' },
        { name: 'start', label: fmT('Date you want service to start', 'Fecha en que quiere que empiece el servicio'), type: 'date', required: true, hint: fmT('Not on the paper form; it helps the office plan the turn-on. Service starts only after the fees are paid.', 'No está en el formulario de papel; ayuda a la oficina a programar la conexión. El servicio empieza solo después de pagar las tarifas.') }
      ] },
      { title: fmT('Rent or own, and employer', 'Alquila o es propietario, y empleador'), fields: [
        { name: 'tenure', label: fmT('Do you rent or own?', '¿Alquila o es propietario?'), type: 'radio', required: true, options: [['rent', fmT('Rent', 'Alquilo')], ['own', fmT('Own', 'Soy propietario')]] },
        { name: 'owner', label: fmT('Owner’s name', 'Nombre del propietario'), when: { name: 'tenure', value: 'rent' }, required: true },
        { name: 'owner_phone', label: fmT('Owner’s telephone', 'Teléfono del propietario'), type: 'tel', when: { name: 'tenure', value: 'rent' }, required: true },
        { name: 'employer', label: fmT('Employer', 'Empleador'), span: true },
        { name: 'employer_address', label: fmT('Employer’s address', 'Dirección del empleador'), type: 'address', span: true },
        { name: 'employer_phone', label: fmT('Employer’s telephone', 'Teléfono del empleador'), type: 'tel' },
        { name: 'ssn_note', type: 'note', label: fmT('Social Security number', 'Número de Seguro Social'), hint: fmT('The paper form asks for it. Virginia Code § 2.2-3808 bars the town from collecting any part of it online without a statute that requires it, so this form does not ask. If the town needs it to run a credit check, staff will ask in person and tell you why.', 'El formulario en papel lo pide. El Código de Virginia § 2.2-3808 prohíbe al pueblo recopilar cualquier parte de él en línea sin una ley que lo exija, por lo que este formulario no lo pide. Si el pueblo lo necesita para una verificación de crédito, el personal se lo pedirá en persona y le explicará por qué.') }
      ] }
    ]
  },
  {
    id: 'parade-entry',
    title: fmT('2026 Christmas Parade Entry Form', 'Formulario de inscripción al Desfile de Navidad 2026'),
    source: 'https://keysvilleva.gov/wp-content/uploads/2026/10/2026-Christmas-Parade-Application.pdf',
    also: ['https://keysvilleva.gov/wp-content/uploads/2025/10/2025-Parade-Application.docx'],
    dept: 'clerk', cat: 'other', minutes: 7,
    purpose: fmT('Enter a float, band, vehicle or marching unit in the lighted evening parade.', 'Inscriba una carroza, banda, vehículo o grupo de marcha en el desfile nocturno iluminado.'),
    intro: fmT('The Keysville Christmas Parade official entry and registration form. Churches, schools, businesses, clubs, bands and vehicle owners use it to enter. Return by Thursday, November 12, 2026. The parade is an evening lighted parade: decorations and seasonal lighting count heavily in judging. No live Santa in any entry (the official Santa rides at the end), no horns or sirens, and toss candy downward toward the curb only. Line-up starts at the Wayland Nursing Home grounds and continues onto King Street, Mary Knoll Lane and Southern Drive.', 'Formulario oficial de inscripción y registro del Desfile de Navidad de Keysville. Lo usan iglesias, escuelas, negocios, clubes, bandas y dueños de vehículos. Entréguelo a más tardar el jueves 12 de noviembre de 2026. Es un desfile nocturno iluminado: la decoración y las luces navideñas pesan mucho en la calificación. No se permite un Santa Claus en ninguna entrada (el Santa oficial va al final), ni bocinas ni sirenas, y los dulces se lanzan hacia abajo, hacia la acera. La fila empieza en los terrenos de Wayland Nursing Home y sigue por King Street, Mary Knoll Lane y Southern Drive.'),
    deadline: fmT('Return by Thursday, November 12, 2026. Music for the judges’ stand is due by November 20, 2026 [the form names a third party to send it to; confirm how the town wants this handled online].', 'Entregar a más tardar el jueves 12 de noviembre de 2026. La música para la tribuna de jueces se entrega a más tardar el 20 de noviembre de 2026 [el formulario indica a un tercero para enviarla; confirmar cómo quiere el pueblo manejarlo en línea].'),
    attachments: [fmT('A typed or clearly printed description of your entry for the MC and judges to read as you pass by. Without it your entry will not be judged. Online, you type it in the box.', 'Una descripción escrita a máquina o con letra clara de su entrada, para que el presentador y los jueces la lean al pasar. Sin ella, su entrada no será calificada. En línea, la escribe en el cuadro.')],
    signText: fmT('By entering this event and signing below, I explicitly understand and agree that the Town of Keysville, event organizers, sponsors, hosts, promoters, participating clubs, and their respective agents, employees, or members will not be held liable or responsible for any injuries, damages, or losses whatsoever. This includes, but is not limited to, damaged vehicles, theft, loss of property, personal injury, or loss of life sustained while traveling to, traveling from, or participating directly within the event. I also fully understand that failure to strictly follow all outlined parade rules and safety personnel instructions may result in immediate expulsion from the event. I have carefully read this liability disclaimer and agree to fully abide by all rules and constraints. A parent or guardian must sign if the participant is under 18.', 'Al inscribirme en este evento y firmar abajo, entiendo y acepto expresamente que el Town of Keysville, los organizadores, patrocinadores, anfitriones, promotores, clubes participantes y sus respectivos agentes, empleados o miembros no serán responsables por lesiones, daños o pérdidas de ningún tipo. Esto incluye, entre otros, daños a vehículos, robo, pérdida de bienes, lesiones personales o pérdida de la vida al ir al evento, al regresar o al participar directamente en él. También entiendo plenamente que no seguir estrictamente las reglas del desfile y las instrucciones del personal de seguridad puede causar la expulsión inmediata del evento. He leído con cuidado esta exención de responsabilidad y acepto cumplir todas las reglas y condiciones. Si el participante es menor de 18 años, debe firmar el padre, la madre o el tutor.'),
    steps: [
      { title: fmT('Applicant and organization', 'Solicitante y organización'), fields: [
        { name: 'org', label: fmT('Organization name', 'Nombre de la organización'), required: true, role: 'where', span: true, auto: 'organization' },
        { name: 'address', label: fmT('Complete address', 'Dirección completa'), type: 'address', required: true, span: true },
        { name: 'contact', label: fmT('Contact person', 'Persona de contacto'), required: true, role: 'name', auto: 'name' },
        { name: 'phone', label: fmT('Phone', 'Teléfono'), type: 'tel', required: true, role: 'contact', auto: 'tel' },
        { name: 'email', label: fmT('Email address', 'Correo electrónico'), type: 'email', required: true, role: 'contact', auto: 'email' },
        { name: 'judged', label: fmT('Do you want your entry judged?', '¿Quiere que su entrada sea calificada?'), type: 'yesno', required: true }
      ] },
      { title: fmT('Entry type and specifications', 'Tipo de entrada y especificaciones'), fields: [
        { name: 'type', label: fmT('Type of entry', 'Tipo de entrada'), type: 'radio', required: true, options: [
          ['band', fmT('Band / marching unit', 'Banda / grupo de marcha')], ['civic', fmT('Civic float', 'Carroza cívica')], ['business', fmT('Business float', 'Carroza de negocio')],
          ['school', fmT('School float', 'Carroza escolar')], ['religious', fmT('Religious float', 'Carroza religiosa')], ['emergency', fmT('Emergency vehicle', 'Vehículo de emergencia')],
          ['show', fmT('Show vehicle', 'Vehículo de exhibición')], ['rig', fmT('Tractor / big rig', 'Tractor / camión grande')], ['moto', fmT('Motorcycle / ATV / side-by-side', 'Motocicleta / cuatrimoto / side-by-side')]
        ] },
        { name: 'length', label: fmT('Total length of entry (feet)', 'Largo total de la entrada (pies)'), type: 'number', required: true, hint: fmT('For floats, measure from the front bumper of the towing vehicle to the very end of the trailer, including the tongue.', 'Para carrozas, mida desde la defensa delantera del vehículo que remolca hasta el final del remolque, incluida la lengüeta.') },
        { name: 'music', label: fmT('Music at the judges’ stand', 'Música en la tribuna de jueces'), type: 'textarea', hint: fmT('Name the song or songs, if any. The form asks for the music file to be sent separately by November 20, 2026.', 'Indique la canción o canciones, si las hay. El formulario pide enviar el archivo de música por separado antes del 20 de noviembre de 2026.') },
        { name: 'description', label: fmT('Description of your entry for the MC and judges', 'Descripción de su entrada para el presentador y los jueces'), type: 'textarea', required: true, span: true, hint: fmT('Read aloud as you pass the judges’ stand. Required to be judged.', 'Se lee en voz alta al pasar por la tribuna de jueces. Es obligatoria para ser calificado.') }
      ] },
      { title: fmT('Who is signing', 'Quién firma'), fields: [
        { name: 'minor', label: fmT('Is the participant under 18?', '¿El participante es menor de 18 años?'), type: 'yesno', required: true },
        { name: 'guardian', label: fmT('Parent or guardian who is signing', 'Padre, madre o tutor que firma'), when: { name: 'minor', value: 'yes' }, required: true, span: true }
      ] }
    ]
  },
  {
    id: 'employment',
    title: fmT('Application for Employment', 'Solicitud de empleo'),
    source: 'https://keysvilleva.gov/wp-content/uploads/2026/06/Standard-Application.pdf',
    dept: 'manager', cat: 'other', minutes: 20,
    purpose: fmT('Apply for a job with the town. Every question must be answered.', 'Solicite un empleo en el pueblo. Hay que responder todas las preguntas.'),
    intro: fmT('The Town of Keysville’s standard application for employment. It is the town’s policy to comply with all applicable state and federal laws prohibiting discrimination in employment based on race, age, color, sex, religion, national origin, disability or other protected classifications. Please read and answer all questions; you will not be considered if you leave questions unanswered. You may attach a résumé, but all questions must be answered. Open positions are posted under public notices.', 'Solicitud de empleo estándar del Town of Keysville. Es política del pueblo cumplir todas las leyes estatales y federales que prohíben la discriminación laboral por raza, edad, color, sexo, religión, origen nacional, discapacidad u otras categorías protegidas. Lea y responda todas las preguntas; no se le tomará en cuenta si deja preguntas sin responder. Puede adjuntar un currículum, pero debe responder todas las preguntas. Las vacantes se publican en los avisos públicos.'),
    attachments: [fmT('A résumé, if you want to add one. The questions still have to be answered.', 'Un currículum, si quiere agregarlo. Igual hay que responder las preguntas.')],
    sensitive: fmT('Applications are read only by the staff doing the hiring. [Confirm with the town attorney how employment applications are kept and whether the felony question stays on the application or moves to the interview.] The form does not ask for a Social Security number, date of birth or driver’s license; do not add them.', 'Las solicitudes las lee solo el personal encargado de la contratación. [Confirmar con el abogado del pueblo cómo se conservan las solicitudes de empleo y si la pregunta sobre delitos graves se mantiene en la solicitud o pasa a la entrevista.] El formulario no pide número de Seguro Social, fecha de nacimiento ni licencia de conducir; no los agregue.'),
    signText: fmT('I certify that the facts set forth in this Application for Employment are true and complete to the best of my knowledge. I understand that if I am employed, false statements, omissions or misrepresentations may result in my dismissal. I authorize the Employer to make an investigation of any of the facts set forth in this application and release the Employer from any liability. The Employer may contact any listed references on this application. I acknowledge and understand that the Employer is an “at will” employer. Therefore, any employee (regular, temporary, or other type of category employee) may resign at any time, just as the Employer may terminate the employment relationship with any employee at any time, with or without cause, with or without notice to the other party.', 'Certifico que los datos de esta Solicitud de Empleo son verdaderos y completos según mi leal saber. Entiendo que, si soy contratado, las declaraciones falsas, omisiones o tergiversaciones pueden causar mi despido. Autorizo al Empleador a investigar cualquiera de los datos de esta solicitud y lo libero de toda responsabilidad. El Empleador puede comunicarse con cualquiera de las referencias indicadas. Reconozco y entiendo que el Empleador contrata “a voluntad”. Por lo tanto, cualquier empleado (regular, temporal u otra categoría) puede renunciar en cualquier momento, así como el Empleador puede terminar la relación laboral con cualquier empleado en cualquier momento, con o sin causa, con o sin aviso a la otra parte.'),
    steps: [
      { title: fmT('Position and personal data', 'Puesto y datos personales'), fields: [
        { name: 'position', label: fmT('Position applying for', 'Puesto que solicita'), required: true, span: true },
        { name: 'name', label: fmT('Name (last, first, middle)', 'Nombre (apellido, nombre, segundo nombre)'), required: true, role: 'name', span: true, auto: 'name' },
        { name: 'street', label: fmT('Street address and/or mailing address', 'Dirección y/o dirección postal'), required: true, span: true, auto: 'address-line1' },
        { name: 'city', label: fmT('City', 'Ciudad'), required: true, auto: 'address-level2' },
        { name: 'state', label: fmT('State', 'Estado'), type: 'state', required: true },
        { name: 'zip', label: fmT('Zip', 'Código postal'), type: 'zip', required: true, auto: 'postal-code' },
        { name: 'phone_home', label: fmT('Home telephone number', 'Teléfono de casa'), type: 'tel', role: 'contact' },
        { name: 'phone_work', label: fmT('Business telephone number', 'Teléfono del trabajo'), type: 'tel' },
        { name: 'phone_cell', label: fmT('Cellular telephone number', 'Teléfono celular'), type: 'tel', required: true, role: 'contact', auto: 'tel' },
        { name: 'email', label: fmT('Email', 'Correo electrónico'), type: 'email', role: 'contact', auto: 'email', hint: fmT('Not on the paper form. Most replies go by email if you give one.', 'No está en el formulario de papel. La mayoría de las respuestas llegan por correo electrónico si indica uno.') },
        { name: 'start', label: fmT('Date you can start work', 'Fecha en que puede empezar a trabajar'), type: 'date', required: true },
        { name: 'salary', label: fmT('Salary desired', 'Salario deseado'), type: 'money', required: true },
        { name: 'diploma', label: fmT('Do you have a high school diploma or GED?', '¿Tiene diploma de secundaria o GED?'), type: 'yesno', required: true }
      ] },
      { title: fmT('Position information', 'Información del puesto'), fields: [
        { name: 'hours', label: fmT('Hours', 'Horario'), type: 'checkbox', required: true, options: [['full', fmT('Full time', 'Tiempo completo')], ['part', fmT('Part time', 'Medio tiempo')]] },
        { name: 'shifts', label: fmT('Shifts you are willing to work', 'Turnos que está dispuesto a trabajar'), type: 'checkbox', required: true, options: [['days', fmT('Days', 'Días')], ['evenings', fmT('Evenings', 'Tardes')], ['swing', fmT('Swing', 'Turno mixto')], ['graveyard', fmT('Graveyard', 'Turno de noche')], ['weekends', fmT('Weekends', 'Fines de semana')]] },
        { name: 'status', label: fmT('Status', 'Tipo de empleo'), type: 'checkbox', required: true, options: [['regular', fmT('Regular', 'Regular')], ['temporary', fmT('Temporary', 'Temporal')]] },
        { name: 'authorized', label: fmT('Are you authorized to work in the U.S. on an unrestricted basis?', '¿Está autorizado para trabajar en los EE. UU. sin restricciones?'), type: 'yesno', required: true },
        { name: 'felony', label: fmT('Have you ever been convicted of a felony? (Convictions will not necessarily disqualify an applicant for employment.)', '¿Alguna vez ha sido condenado por un delito grave? (Una condena no necesariamente descalifica al solicitante.)'), type: 'yesno', required: true },
        { name: 'felony_explain', label: fmT('If yes, explain', 'Si respondió sí, explique'), type: 'textarea', when: { name: 'felony', value: 'yes' }, required: true, span: true },
        { name: 'functions', label: fmT('Have you been told the essential functions of the job, or seen a copy of the job description listing them?', '¿Le informaron las funciones esenciales del puesto o vio una copia de la descripción del puesto que las enumera?'), type: 'yesno', required: true },
        { name: 'perform', label: fmT('Can you perform these essential functions of the job with or without reasonable accommodation?', '¿Puede realizar estas funciones esenciales del puesto con o sin una adaptación razonable?'), type: 'yesno', required: true }
      ] },
      { title: fmT('Qualifications and skills', 'Formación y habilidades'), note: fmT('List any education or training that relates to the position and would help you perform the work, such as schools, colleges, degrees, vocational or technical programs, and military training.', 'Indique la educación o capacitación relacionada con el puesto que le ayudaría a realizar el trabajo, como escuelas, universidades, títulos, programas vocacionales o técnicos y capacitación militar.'),
        fields: fmSchool(1, fmT('School', 'Escuela')).concat(fmSchool(2, fmT('Second school', 'Segunda escuela')), fmSchool(3, fmT('Other training', 'Otra capacitación')), [
          { name: 'skills', label: fmT('Special skills or experience that would help you in this position (leadership, organizations, teams, and so on)', 'Habilidades o experiencia especiales que le ayudarían en este puesto (liderazgo, organizaciones, equipos, etc.)'), type: 'textarea', required: true, span: true },
          { name: 'resume', label: fmT('Résumé (optional)', 'Currículum (opcional)'), type: 'file' }
        ]) },
      { title: fmT('References', 'Referencias'), note: fmT('Three professional references not related to you, with full name, address, phone number and relationship. If you don’t have three professional references, list personal, unrelated references.', 'Tres referencias profesionales que no sean familiares, con nombre completo, dirección, teléfono y relación. Si no tiene tres referencias profesionales, indique referencias personales que no sean familiares.'),
        fields: fmReference(1).concat(fmReference(2), fmReference(3)) },
      { title: fmT('Work history', 'Historial laboral'), note: fmT('Start with your present or most recent employment and work back. Include paid and unpaid positions.', 'Empiece por su empleo actual o más reciente y siga hacia atrás. Incluya puestos pagados y no pagados.'),
        fields: fmJob(1).concat([{ name: 'contact_present', label: fmT('May we contact your present employer?', '¿Podemos comunicarnos con su empleador actual?'), type: 'radio', required: true, options: [['yes', fmT('Yes', 'Sí')], ['no', fmT('No', 'No')], ['na', fmT('Not applicable', 'No aplica')]] }], fmJob(2)) },
      { title: fmT('Earlier jobs', 'Empleos anteriores'), note: fmT('Optional. Leave these blank if the two jobs above cover your work history.', 'Opcional. Déjelos en blanco si los dos empleos anteriores cubren su historial.'),
        fields: fmJob(3).concat(fmJob(4)) }
    ]
  },
  {
    id: 'broadband-survey',
    title: fmT('Broadband Internet Survey', 'Encuesta sobre internet de banda ancha'),
    source: 'https://keysvilleva.gov/wp-content/uploads/2024/11/Broadband-Internet-Survey.pdf',
    dept: 'manager', cat: 'other', minutes: 12,
    purpose: fmT('Tell the region what internet you have at home and what gets in the way.', 'Cuéntele a la región qué internet tiene en casa y qué se lo impide.'),
    intro: fmT('A regional survey on broadband access, affordability and digital skills, posted by the town in November 2024 with the Regional Broadband Affordability and Adoption Plan meetings. [Confirm the survey is still open.] In this survey, “broadband” means high-speed internet with download speeds of at least 25 Mbps and upload speeds of at least 3 Mbps, as defined by the FCC. It takes about 10 to 15 minutes. We do not ask your name, so your answers are anonymous. (A town cannot promise confidentiality, because what it receives is a public record.) The paper survey ends with a demographic section (gender, race, income, education, disability); the online version leaves those questions out.', 'Encuesta regional sobre acceso a banda ancha, asequibilidad y habilidades digitales, publicada por el pueblo en noviembre de 2024 junto con las reuniones del Plan Regional de Asequibilidad y Adopción de Banda Ancha. [Confirmar que la encuesta sigue abierta.] En esta encuesta, “banda ancha” significa internet de alta velocidad con al menos 25 Mbps de descarga y 3 Mbps de subida, según la definición de la FCC. Toma de 10 a 15 minutos. No pedimos su nombre, así que sus respuestas son anónimas. (Un pueblo no puede prometer confidencialidad, porque lo que recibe es un registro público.) La encuesta en papel termina con una sección demográfica (género, raza, ingresos, educación, discapacidad); la versión en línea no incluye esas preguntas.'),
    sensitive: fmT('No name or address is asked. Zip code, age range and household size are the only details about you, and each has a “prefer not to say” choice.', 'No se pide nombre ni dirección. El código postal, el rango de edad y el tamaño del hogar son los únicos datos sobre usted, y cada uno tiene la opción “prefiero no decir”.'),
    anonymous: true,
    steps: [
      { title: fmT('Your internet today', 'Su internet hoy'), fields: [
        { name: 'q1', label: fmT('What type of internet access do you currently have at home?', '¿Qué tipo de acceso a internet tiene actualmente en casa?'), type: 'checkbox', required: true, options: [['broadband', fmT('Broadband (cable or fiber)', 'Banda ancha (cable o fibra)')], ['dsl', fmT('DSL', 'DSL')], ['satellite', fmT('Satellite', 'Satélite')], ['cellular', fmT('Cellular data plan', 'Plan de datos celulares')], ['dialup', fmT('Dial-up', 'Conexión telefónica')], ['none', fmT('None', 'Ninguno')], ['unknown', fmT('I have internet, but I do not know what kind', 'Tengo internet, pero no sé de qué tipo')]] },
        { name: 'q2', label: fmT('If you do not have broadband access, what is the primary reason?', 'Si no tiene banda ancha, ¿cuál es la razón principal?'), type: 'radio', options: [['cost', fmT('Cost is too high', 'El costo es demasiado alto')], ['unavailable', fmT('Broadband is not available in my area', 'No hay banda ancha en mi zona')], ['noneed', fmT('I do not need broadband', 'No necesito banda ancha')], ['cellular', fmT('I use a cellular data plan instead', 'Uso un plan de datos celulares')], ['unsure', fmT('I am unsure how to get broadband', 'No sé cómo conseguir banda ancha')], ['technical', fmT('Technical difficulties setting it up', 'Dificultades técnicas para instalarla')], ['other', fmT('Other', 'Otro')]] },
        { name: 'q2_other', label: fmT('Other reason', 'Otra razón'), when: { name: 'q2', value: 'other' }, span: true },
        { name: 'q3', label: fmT('How long have you had broadband internet access at home?', '¿Cuánto tiempo lleva con banda ancha en casa?'), type: 'radio', required: true, options: [['lt6m', fmT('Less than 6 months', 'Menos de 6 meses')], ['6m1y', fmT('6 months to 1 year', 'De 6 meses a 1 año')], ['1to2', fmT('1 to 2 years', 'De 1 a 2 años')], ['gt2', fmT('More than 2 years', 'Más de 2 años')], ['none', fmT('I do not have broadband access', 'No tengo banda ancha')]] },
        { name: 'q4', label: fmT('What factors influenced your choice of internet service provider?', '¿Qué factores influyeron en su elección de proveedor de internet?'), type: 'checkbox', options: [['cost', fmT('Cost', 'Costo')], ['reliability', fmT('Reliability', 'Confiabilidad')], ['speed', fmT('Speed', 'Velocidad')], ['service', fmT('Customer service', 'Servicio al cliente')], ['availability', fmT('Availability in my area', 'Disponibilidad en mi zona')], ['recommend', fmT('Recommendations from others', 'Recomendaciones de otras personas')], ['promo', fmT('Promotions or discounts', 'Promociones o descuentos')], ['other', fmT('Other', 'Otro')]] },
        { name: 'q5', label: fmT('How often do you experience issues with your internet service (slow speeds, disconnections)?', '¿Con qué frecuencia tiene problemas con su servicio de internet (lentitud, desconexiones)?'), type: 'radio', required: true, options: [['daily', fmT('Daily', 'A diario')], ['weekly', fmT('Weekly', 'Cada semana')], ['monthly', fmT('Monthly', 'Cada mes')], ['rarely', fmT('Rarely', 'Rara vez')], ['never', fmT('Never', 'Nunca')]] },
        { name: 'q6', label: fmT('Are you open to exploring alternative broadband options if they were available and more affordable?', '¿Estaría dispuesto a explorar otras opciones de banda ancha si estuvieran disponibles y fueran más asequibles?'), type: 'yesno', required: true },
        { name: 'q7', label: fmT('How important is it for you to have affordable broadband access?', '¿Qué tan importante es para usted tener banda ancha asequible?'), type: 'radio', required: true, options: [['0', fmT('Not important at all', 'Nada importante')], ['1', fmT('Slightly important', 'Poco importante')], ['2', fmT('Somewhat important', 'Algo importante')], ['3', fmT('Fairly important', 'Bastante importante')], ['4', fmT('Important', 'Importante')], ['5', fmT('Very important', 'Muy importante')]] }
      ] },
      { title: fmT('Cost and how well it works', 'Costo y qué tan bien funciona'), fields: [
        { name: 'q8', label: fmT('How much do you pay each month for internet service (excluding cellular plans)?', '¿Cuánto paga al mes por el servicio de internet (sin contar planes celulares)?'), type: 'radio', required: true, options: [['lt20', fmT('Less than $20', 'Menos de $20')], ['20', fmT('$20 to $39', 'De $20 a $39')], ['40', fmT('$40 to $59', 'De $40 a $59')], ['60', fmT('$60 to $79', 'De $60 a $79')], ['80', fmT('$80 to $99', 'De $80 a $99')], ['100', fmT('$100 to $119', 'De $100 a $119')], ['120', fmT('$120 or more', '$120 o más')], ['none', fmT('I do not pay for internet service', 'No pago por el servicio de internet')]] },
        { name: 'q9', label: fmT('How well does your current internet service meet your household’s needs?', '¿Qué tan bien cubre su servicio actual las necesidades de su hogar?'), type: 'radio', required: true, options: [['0', fmT('Does not meet them at all', 'No las cubre en absoluto')], ['1', fmT('Barely meets them', 'Apenas las cubre')], ['2', fmT('Partially meets them', 'Las cubre parcialmente')], ['3', fmT('Mostly meets them', 'Las cubre en su mayoría')], ['4', fmT('Almost fully meets them', 'Las cubre casi por completo')], ['5', fmT('Fully meets them', 'Las cubre por completo')]] },
        { name: 'q10', label: fmT('Have you canceled or downgraded your internet service in the past 12 months due to cost?', '¿Canceló o redujo su servicio de internet en los últimos 12 meses por el costo?'), type: 'yesno', required: true },
        { name: 'q10_explain', label: fmT('If yes, please explain', 'Si respondió sí, explique'), type: 'textarea', when: { name: 'q10', value: 'yes' }, span: true },
        { name: 'q11', label: fmT('Would you be willing to pay more for improved broadband internet service?', '¿Estaría dispuesto a pagar más por un mejor servicio de banda ancha?'), type: 'radio', required: true, options: [['yes', fmT('Yes, I would pay more', 'Sí, pagaría más')], ['no', fmT('No, I would not pay more', 'No, no pagaría más')], ['howmuch', fmT('It depends on how much more', 'Depende de cuánto más')], ['improved', fmT('It depends on how much the service is improved', 'Depende de cuánto mejore el servicio')]] },
        { name: 'q12', label: fmT('How often do you use the internet?', '¿Con qué frecuencia usa internet?'), type: 'radio', required: true, options: [['daily', fmT('Daily', 'A diario')], ['several', fmT('Several times a week', 'Varias veces por semana')], ['weekly', fmT('Weekly', 'Cada semana')], ['monthly', fmT('Monthly', 'Cada mes')], ['rarely', fmT('Rarely', 'Rara vez')], ['never', fmT('Never', 'Nunca')]] },
        { name: 'q13', label: fmT('What activities do you primarily engage in online?', '¿Qué actividades realiza principalmente en línea?'), type: 'checkbox', required: true, options: [['work', fmT('Work', 'Trabajo')], ['education', fmT('Education', 'Educación')], ['entertainment', fmT('Entertainment (streaming, gaming)', 'Entretenimiento (streaming, videojuegos)')], ['social', fmT('Social media', 'Redes sociales')], ['shopping', fmT('Online shopping', 'Compras en línea')], ['health', fmT('Healthcare (telemedicine, online health resources)', 'Salud (telemedicina, recursos de salud en línea)')], ['banking', fmT('Paying bills or banking', 'Pagar cuentas o banca')], ['family', fmT('Communicating with family and friends', 'Comunicarme con familiares y amigos')], ['other', fmT('Other', 'Otro')]] },
        { name: 'q14', label: fmT('What devices do you primarily use to access the internet?', '¿Qué dispositivos usa principalmente para conectarse a internet?'), type: 'checkbox', required: true, options: [['phone', fmT('Smartphone', 'Teléfono inteligente')], ['tablet', fmT('Tablet', 'Tableta')], ['laptop', fmT('Laptop', 'Computadora portátil')], ['desktop', fmT('Desktop computer', 'Computadora de escritorio')], ['tv', fmT('Smart TV', 'Televisor inteligente')], ['other', fmT('Other', 'Otro')]] }
      ] },
      { title: fmT('Barriers', 'Obstáculos'), fields: [
        { name: 'q15', label: fmT('Are there specific areas in your community where broadband access is limited or unavailable?', '¿Hay zonas específicas de su comunidad donde la banda ancha es limitada o no existe?'), type: 'yesno', required: true },
        { name: 'q15_where', label: fmT('If yes, which areas?', 'Si respondió sí, ¿cuáles zonas?'), when: { name: 'q15', value: 'yes' }, span: true },
        { name: 'q16', label: fmT('What is the primary barrier preventing you from obtaining broadband service or improving your current service?', '¿Cuál es el principal obstáculo para obtener banda ancha o mejorar su servicio actual?'), type: 'radio', required: true, options: [['cost', fmT('Cost is too high', 'El costo es demasiado alto')], ['unavailable', fmT('Broadband is not available in my area', 'No hay banda ancha en mi zona')], ['info', fmT('Lack of information about options', 'Falta de información sobre las opciones')], ['technical', fmT('Technical difficulties with setup or connection', 'Dificultades técnicas de instalación o conexión')], ['satisfied', fmT('I am satisfied with my current service', 'Estoy satisfecho con mi servicio actual')], ['noneed', fmT('I do not need broadband', 'No necesito banda ancha')], ['other', fmT('Other', 'Otro')]] },
        { name: 'q17', label: fmT('Has a lack of broadband access ever prevented you from accessing essential services such as healthcare?', '¿La falta de banda ancha le ha impedido alguna vez acceder a servicios esenciales, como atención médica?'), type: 'yesno', required: true },
        { name: 'q17_which', label: fmT('If yes, which services?', 'Si respondió sí, ¿qué servicios?'), when: { name: 'q17', value: 'yes' }, span: true },
        { name: 'q18', label: fmT('Do you have difficulties using digital devices (computers, smartphones or tablets) that make it hard to use the internet?', '¿Tiene dificultades para usar dispositivos digitales (computadoras, teléfonos o tabletas) que le complican usar internet?'), type: 'yesno', required: true },
        { name: 'q18_which', label: fmT('If yes, which difficulties?', 'Si respondió sí, ¿cuáles dificultades?'), type: 'checkbox', when: { name: 'q18', value: 'yes' }, options: [['setup', fmT('Difficulty with setup', 'Dificultad para configurarlos')], ['slow', fmT('Slow device', 'Dispositivo lento')], ['skills', fmT('Lack of skills', 'Falta de habilidades')], ['other', fmT('Other', 'Otro')]] },
        { name: 'q19', label: fmT('What challenges do you or someone in your household face when using digital devices for essential services?', '¿Qué dificultades enfrentan usted o alguien de su hogar al usar dispositivos digitales para servicios esenciales?'), type: 'checkbox', options: [['skills', fmT('Lack of skills', 'Falta de habilidades')], ['technical', fmT('Technical difficulties (device or software issues)', 'Dificultades técnicas (problemas del dispositivo o del software)')], ['old', fmT('Device is too old or slow', 'El dispositivo es demasiado viejo o lento')], ['access', fmT('Accessibility issues (vision or mobility problems)', 'Problemas de accesibilidad (visión o movilidad)')], ['other', fmT('Other', 'Otro')]] },
        { name: 'q20', label: fmT('Have you ever applied for financial assistance or discount programs to help with broadband access?', '¿Alguna vez solicitó ayuda económica o programas de descuento para la banda ancha?'), type: 'radio', required: true, options: [['yes', fmT('Yes', 'Sí')], ['unaware', fmT('No, I am not aware of any programs', 'No, no conozco ningún programa')], ['noneed', fmT('No, I do not need financial assistance', 'No, no necesito ayuda económica')], ['howto', fmT('No, I don’t know how to apply for such programs', 'No, no sé cómo solicitarlos')]] },
        { name: 'q21', label: fmT('What options or resources would help you or others in your community gain better internet access?', '¿Qué opciones o recursos le ayudarían a usted o a otros en su comunidad a tener mejor acceso a internet?'), type: 'checkbox', options: [['subsidy', fmT('Subsidized or discounted broadband service plans', 'Planes de banda ancha subsidiados o con descuento')], ['wifi', fmT('More public Wi-Fi locations (libraries, community centers)', 'Más puntos de Wi-Fi público (bibliotecas, centros comunitarios)')], ['training', fmT('Digital literacy training programs (email, websites, online safety)', 'Programas de alfabetización digital (correo electrónico, sitios web, seguridad en línea)')], ['devices', fmT('Low-cost or free devices (laptops, tablets)', 'Dispositivos gratuitos o de bajo costo (portátiles, tabletas)')], ['support', fmT('Technical support services (setting up devices, troubleshooting)', 'Servicios de soporte técnico (configuración, solución de problemas)')], ['other', fmT('Other', 'Otro')]] }
      ] },
      { title: fmT('Digital skills', 'Habilidades digitales'), fields: [
        { name: 'q22', label: fmT('How would you rate your ability to navigate the internet and use digital devices for online tasks?', '¿Cómo calificaría su capacidad para navegar por internet y usar dispositivos digitales?'), type: 'radio', required: true, options: [['0', fmT('Very poor', 'Muy mala')], ['1', fmT('Poor', 'Mala')], ['2', fmT('Fair', 'Regular')], ['3', fmT('Good', 'Buena')], ['4', fmT('Very good', 'Muy buena')], ['5', fmT('Excellent', 'Excelente')]] },
        { name: 'q23', label: fmT('What specific digital skills do you feel you need to improve?', '¿Qué habilidades digitales cree que necesita mejorar?'), type: 'checkbox', options: [['basic', fmT('Basic computer skills (mouse, keyboard)', 'Habilidades básicas de computación (ratón, teclado)')], ['email', fmT('Using email', 'Usar el correo electrónico')], ['web', fmT('Navigating websites', 'Navegar por sitios web')], ['safety', fmT('Online safety and security (passwords, avoiding scams)', 'Seguridad en línea (contraseñas, evitar estafas)')], ['video', fmT('Using video conferencing tools', 'Usar herramientas de videoconferencia')], ['health', fmT('Accessing healthcare services online', 'Acceder a servicios de salud en línea')], ['banking', fmT('Using online banking or paying bills', 'Usar la banca en línea o pagar cuentas')], ['jobs', fmT('Job searching or applying for jobs online', 'Buscar o solicitar empleo en línea')], ['other', fmT('Other', 'Otro')]] },
        { name: 'q24', label: fmT('Would you be interested in digital skills training?', '¿Le interesaría una capacitación en habilidades digitales?'), type: 'yesno', required: true },
        { name: 'q24_topics', label: fmT('If yes, which topics?', 'Si respondió sí, ¿qué temas?'), when: { name: 'q24', value: 'yes' }, span: true },
        { name: 'q25', label: fmT('Would you or older adults in your household benefit from digital literacy training designed for older adults?', '¿Usted o los adultos mayores de su hogar se beneficiarían de una capacitación digital diseñada para adultos mayores?'), type: 'radio', required: true, options: [['me', fmT('Yes, I would benefit', 'Sí, yo me beneficiaría')], ['elder', fmT('Yes, an older adult in my household would benefit', 'Sí, un adulto mayor de mi hogar se beneficiaría')], ['both', fmT('Yes, both of us would benefit', 'Sí, ambos nos beneficiaríamos')], ['noneed', fmT('No, we do not need this training', 'No, no necesitamos esta capacitación')], ['noelder', fmT('No older adults in my household', 'No hay adultos mayores en mi hogar')]] },
        { name: 'q26', label: fmT('In your opinion, do older people in your community have adequate support to access and use the internet?', 'En su opinión, ¿las personas mayores de su comunidad tienen apoyo suficiente para acceder a internet y usarlo?'), type: 'radio', required: true, options: [['yes', fmT('Yes, they have sufficient support and face no major barriers', 'Sí, tienen apoyo suficiente y no enfrentan grandes obstáculos')], ['some', fmT('They have some support, but face occasional difficulties', 'Tienen algo de apoyo, pero enfrentan dificultades ocasionales')], ['no', fmT('No, they need much more support', 'No, necesitan mucho más apoyo')], ['unknown', fmT('I don’t know', 'No lo sé')]] },
        { name: 'q27', label: fmT('What is the biggest barrier to achieving broadband access in every household? (For example high cost, lack of infrastructure, limited digital skills, not knowing the options.)', '¿Cuál es el mayor obstáculo para que todos los hogares tengan banda ancha? (Por ejemplo, costo alto, falta de infraestructura, pocas habilidades digitales, desconocer las opciones.)'), type: 'textarea', span: true },
        { name: 'q28', label: fmT('What do you think is the best way to make sure everyone who wants to can access broadband at home? (For example digital skills training, affordable plans, better infrastructure, technical support.)', '¿Cuál cree que es la mejor manera de asegurar que todos los que quieran tengan banda ancha en casa? (Por ejemplo, capacitación digital, planes asequibles, mejor infraestructura, soporte técnico.)'), type: 'textarea', span: true },
        { name: 'q29', label: fmT('How would better internet access improve your household’s quality of life?', '¿Cómo mejoraría un mejor acceso a internet la calidad de vida de su hogar?'), type: 'checkbox', options: [['work', fmT('Easier access to work or remote employment', 'Acceso más fácil al trabajo o al empleo remoto')], ['health', fmT('Better access to healthcare services', 'Mejor acceso a servicios de salud')], ['education', fmT('Improved educational opportunities', 'Mejores oportunidades educativas')], ['family', fmT('Easier communication with family and friends', 'Comunicación más fácil con familiares y amigos')], ['leisure', fmT('Access to entertainment and leisure', 'Acceso a entretenimiento y ocio')], ['gov', fmT('Access to government and community services', 'Acceso a servicios gubernamentales y comunitarios')], ['other', fmT('Other', 'Otro')]] }
      ] },
      { title: fmT('About your household', 'Sobre su hogar'), fields: [
        { name: 'q30', label: fmT('What is your zip code?', '¿Cuál es su código postal?'), type: 'zip', auto: 'postal-code' },
        { name: 'q31', label: fmT('What is your age?', '¿Cuál es su edad?'), type: 'radio', options: [['u18', fmT('Under 18', 'Menos de 18')], ['18', fmT('18 to 24', 'De 18 a 24')], ['25', fmT('25 to 34', 'De 25 a 34')], ['35', fmT('35 to 44', 'De 35 a 44')], ['45', fmT('45 to 54', 'De 45 a 54')], ['55', fmT('55 to 64', 'De 55 a 64')], ['65', fmT('65 or older', '65 o más')], ['pns', fmT('Prefer not to say', 'Prefiero no decir')]] },
        { name: 'q34', label: fmT('In which town or county do you live?', '¿En qué pueblo o condado vive?'), type: 'select', required: true, options: [['keysville', fmT('Town of Keysville', 'Town of Keysville')], ['charlotte', fmT('Charlotte County', 'Condado de Charlotte')], ['cch', fmT('Town of Charlotte Court House', 'Town of Charlotte Court House')], ['drakes', fmT('Town of Drakes Branch', 'Town of Drakes Branch')], ['phenix', fmT('Town of Phenix', 'Town of Phenix')], ['amelia', fmT('Amelia County', 'Condado de Amelia')], ['buckingham', fmT('Buckingham County', 'Condado de Buckingham')], ['cumberland', fmT('Cumberland County', 'Condado de Cumberland')], ['lunenburg', fmT('Lunenburg County', 'Condado de Lunenburg')], ['nottoway', fmT('Nottoway County', 'Condado de Nottoway')], ['pe', fmT('Prince Edward County', 'Condado de Prince Edward')], ['farmville', fmT('Town of Farmville', 'Town of Farmville')], ['blackstone', fmT('Town of Blackstone', 'Town of Blackstone')], ['crewe', fmT('Town of Crewe', 'Town of Crewe')], ['burkeville', fmT('Town of Burkeville', 'Town of Burkeville')], ['kenbridge', fmT('Town of Kenbridge', 'Town of Kenbridge')], ['victoria', fmT('Town of Victoria', 'Town of Victoria')], ['dillwyn', fmT('Town of Dillwyn', 'Town of Dillwyn')], ['other', fmT('Other', 'Otro')]] },
        { name: 'q36', label: fmT('What best describes your employment status?', '¿Qué describe mejor su situación laboral?'), type: 'radio', options: [['full', fmT('Employed full-time', 'Empleado a tiempo completo')], ['part', fmT('Employed part-time', 'Empleado a medio tiempo')], ['unemployed', fmT('Unemployed', 'Desempleado')], ['student', fmT('Student', 'Estudiante')], ['retired', fmT('Retired', 'Jubilado')], ['self', fmT('Self-employed', 'Trabajador independiente')], ['pns', fmT('Prefer not to say', 'Prefiero no decir')], ['other', fmT('Other', 'Otro')]] },
        { name: 'q37', label: fmT('How many people live in your household, including yourself?', '¿Cuántas personas viven en su hogar, incluido usted?'), type: 'radio', options: [['1', fmT('1 (I live alone)', '1 (vivo solo)')], ['2', fmT('2', '2')], ['3', fmT('3', '3')], ['4', fmT('4', '4')], ['5', fmT('5', '5')], ['6', fmT('6 or more', '6 o más')]] }
      ] }
    ]
  }
];

/* Source url to form id, so the document library can offer "Fill out online".
   REAL_DOCS rows get a formId at load; the documents view reads it if it wants to. */
var FORM_BY_URL = {};
FORMS.forEach(function (f) {
  FORM_BY_URL[f.source] = f.id;
  (f.also || []).forEach(function (u) { FORM_BY_URL[u] = f.id; });
});
if (typeof REAL_DOCS !== 'undefined') REAL_DOCS.forEach(function (d) { if (FORM_BY_URL[d.url]) d.formId = FORM_BY_URL[d.url]; });

function fmSpec(id) { for (var i = 0; i < FORMS.length; i++) if (FORMS[i].id === id) return FORMS[i]; return null; }
function fmNum(v) { var n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.]/g, '')); return isNaN(n) ? -1 : n; }
function fmDraftKey(id) { return 'keysville-draft-' + id; }

/* Per-form state. The draft lives in localStorage so a refresh keeps it. */
function fmState(id) {
  if (!U.v.forms) U.v.forms = {};
  var st = U.v.forms[id];
  if (!st) {
    st = { step: 0, answers: {}, done: null, restored: false };
    try {
      var raw = localStorage.getItem(fmDraftKey(id));
      if (raw) { var d = JSON.parse(raw); if (d && d.answers) { st.answers = d.answers; st.step = d.step || 0; st.restored = Object.keys(d.answers).length > 0; } }
    } catch (e) { /* storage may be blocked */ }
    U.v.forms[id] = st;
  }
  return st;
}
function fmSaveDraft(id) {
  var st = fmState(id);
  try { localStorage.setItem(fmDraftKey(id), JSON.stringify({ step: st.step, answers: st.answers })); } catch (e) { /* ignore */ }
}
function fmClearDraft(id) {
  try { localStorage.removeItem(fmDraftKey(id)); } catch (e) { /* ignore */ }
  if (U.v.forms) delete U.v.forms[id];
}

function fmShown(field, answers) {
  if (!field.when) return true;
  var v = answers[field.when.name] || '';
  return (',' + v + ',').indexOf(',' + field.when.value + ',') !== -1;
}
function fmOptions(field) {
  if (field.type === 'yesno') return FM_YESNO;
  if (field.type === 'state') return FM_STATES.map(function (s) { return [s, fmT(s, s)]; });
  return field.options || [];
}
function fmOptionLabel(field, value) {
  var opts = fmOptions(field), out = [];
  String(value || '').split(',').forEach(function (v) {
    if (!v) return;
    var hit = null;
    opts.forEach(function (o) { if (o[0] === v) hit = o; });
    out.push(hit ? L(hit[1]) : v);
  });
  return out.join(', ');
}
/* One answer, worded for people */
function fmDisplay(field, value) {
  if (value == null || value === '') return '';
  if (field.type === 'radio' || field.type === 'yesno' || field.type === 'select' || field.type === 'checkbox' || field.type === 'state') return fmOptionLabel(field, value);
  if (field.type === 'date') return fmtDate(value, 'long');
  if (field.type === 'money') { var n = fmNum(value); return n < 0 ? String(value) : '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); }
  return String(value);
}

function fmControl(f, id, value, answers) {
  var type = f.type || 'text';
  var req = f.required ? (/^(date|time|file)$/.test(type) ? ' required' : ' aria-required="true"') : '';
  var mark = f.required ? ' <span class="req" aria-hidden="true">*</span><span class="sr-only"> ' + t('required') + '</span>' : '';
  var hint = f.hint ? L(f.hint) : '';
  if (f.mask === 'last4') hint = t('fm_last4_hint');
  if (type === 'file') hint = (hint ? hint + ' ' : '') + t('fm_file_note');
  if (type === 'money' && !hint) hint = t('fm_money_hint');
  var describe = hint ? ' aria-describedby="' + id + '-hint"' : '';
  var extra = (f.auto ? ' autocomplete="' + f.auto + '"' : '');
  var hintEl = hint ? '<p class="hint" id="' + id + '-hint">' + esc(hint) + '</p>' : '';
  var errEl = '<p class="err" data-err="' + f.name + '" hidden></p>';
  var wrapCls = 'field fm-field' + (f.span ? ' span' : '') + (f.when ? ' fm-field-cond' : '');
  var control;

  // A note is a field that only explains something, with nothing to fill in.
  if (type === 'note') {
    return '<div class="' + wrapCls + ' span"><p class="label">' + esc(L(f.label)) + '</p><p class="callout callout-pine small">' + esc(hint) + '</p></div>';
  }

  if (type === 'radio' || type === 'yesno' || type === 'checkbox') {
    var opts = fmOptions(f), isCheck = type === 'checkbox';
    var picked = String(value || '').split(',');
    var legendHint = isCheck ? t('fm_check_all') : t('fm_choose_one');
    var items = opts.map(function (o, i) {
      var oid = id + '-' + i;
      var on = picked.indexOf(o[0]) !== -1;
      return '<label class="' + (isCheck ? 'check' : 'radio-card') + '" for="' + oid + '"><input type="' + (isCheck ? 'checkbox' : 'radio') + '" id="' + oid + '" name="' + f.name + '" value="' + esc(o[0]) + '"' + (on ? ' checked' : '') + (i === 0 && f.required && !isCheck ? ' aria-required="true"' : '') + '>' +
        '<span>' + esc(L(o[1])) + '</span></label>';
    }).join('');
    return '<fieldset class="' + wrapCls + '"><legend>' + esc(L(f.label)) + mark + '</legend><p class="hint" id="' + id + '-hint">' + esc((hint ? hint + ' ' : '') + legendHint) + '</p>' +
      '<div class="' + (isCheck ? 'fm-checks' : 'radio-cards') + '">' + items + '</div>' + errEl + '</fieldset>';
  }
  if (type === 'select' || type === 'state') {
    control = '<select class="select" id="' + id + '" name="' + f.name + '"' + req + describe + extra + '><option value="">' + esc(t('pb_choose')) + '</option>' +
      fmOptions(f).map(function (o) { return '<option value="' + esc(o[0]) + '"' + (value === o[0] ? ' selected' : '') + '>' + esc(L(o[1])) + '</option>'; }).join('') + '</select>';
  } else if (type === 'textarea' || type === 'address') {
    control = '<textarea class="textarea' + (type === 'address' ? ' fm-address' : '') + '" id="' + id + '" name="' + f.name + '" rows="' + (type === 'address' ? 2 : 4) + '"' + req + describe + (type === 'address' ? ' autocomplete="street-address"' : extra) + '>' + esc(value || '') + '</textarea>';
  } else if (type === 'money') {
    control = '<div class="fm-money"><span class="fm-money-sign" aria-hidden="true">$</span><input class="input" type="text" inputmode="decimal" id="' + id + '" name="' + f.name + '" value="' + esc(value || '') + '"' + req + describe + '></div>';
  } else if (type === 'file') {
    control = '<input class="input fm-file" type="file" id="' + id + '" name="' + f.name + '"' + req + describe + '>' +
      (value ? '<p class="small fm-file-name">' + icon('doc') + ' ' + esc(value) + '</p>' : '');
  } else if (f.mask === 'last4') {
    control = '<input class="input fm-last4" type="text" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" id="' + id + '" name="' + f.name + '" value="' + esc(value || '') + '"' + req + describe + ' autocomplete="off">';
  } else {
    var itype = type === 'number' || type === 'zip' ? 'text' : type;
    var imode = type === 'number' ? ' inputmode="numeric"' : type === 'zip' ? ' inputmode="numeric" maxlength="10"' : type === 'tel' ? ' inputmode="tel"' : '';
    control = '<input class="input' + (type === 'number' || type === 'zip' ? ' fm-short' : '') + '" type="' + itype + '" id="' + id + '" name="' + f.name + '" value="' + esc(value || '') + '"' + req + describe + extra + imode + '>';
  }
  return '<div class="' + wrapCls + '"><label for="' + id + '">' + esc(L(f.label)) + mark + '</label>' + control + hintEl + errEl + '</div>';
}

function fmRules(spec, stepIdx, answers) {
  var rules = [];
  spec.steps[stepIdx].fields.forEach(function (f) {
    if (!fmShown(f, answers)) return;
    var label = L(f.label).replace(/[?:.]\s*$/, '');
    var isChoice = f.type === 'radio' || f.type === 'yesno' || f.type === 'select' || f.type === 'checkbox' || f.type === 'state';
    if (f.required) rules.push({ name: f.name, required: true, msg: isChoice ? t('fm_err_choose', { label: label }) : t('fm_err_required', { label: label }) });
    if (f.type === 'email') rules.push({ name: f.name, pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, msg: t('fm_err_email', { label: label }) });
    if (f.type === 'tel') rules.push({ name: f.name, pattern: /^[0-9()+.\-\s]{7,}$/, msg: t('fm_err_tel', { label: label }) });
    if (f.type === 'number' || f.type === 'money') rules.push({ name: f.name, pattern: /^[0-9][0-9,]*(\.[0-9]+)?$/, msg: t('fm_err_number', { label: label }) });
    if (f.type === 'zip') rules.push({ name: f.name, pattern: /^[0-9]{5}(-[0-9]{4})?$/, msg: t('fm_err_number', { label: label }) });
    if (f.mask === 'last4') rules.push({ name: f.name, pattern: /^[0-9]{4}$/, msg: t('fm_err_last4', { label: label }) });
  });
  return rules;
}

/* Reads a step's controls into answers. File inputs keep the file name only. */
function fmCollect(form, spec, stepIdx, answers) {
  spec.steps[stepIdx].fields.forEach(function (f) {
    var el = form.elements[f.name];
    if (!el) return;
    if (f.type === 'checkbox') {
      answers[f.name] = Array.prototype.filter.call(el.length && !el.tagName ? el : [el], function (x) { return x.checked; }).map(function (x) { return x.value; }).join(',');
    } else if (f.type === 'radio' || f.type === 'yesno') {
      var on = Array.prototype.filter.call(el.length && !el.tagName ? el : [el], function (x) { return x.checked; })[0];
      answers[f.name] = on ? on.value : '';
    } else if (f.type === 'file') {
      if (el.files && el.files.length) answers[f.name] = el.files[0].name;
    } else {
      answers[f.name] = (el.value || '').trim();
    }
  });
}

function fmStepList(spec, current, hasSign) {
  var names = spec.steps.map(function (s) { return L(s.title); });
  names.push(hasSign ? t('fm_review') : t('fm_review_only'));
  return '<div role="group" aria-label="' + esc(t('fm_steps_label')) + '"><ol class="fm-steps">' + names.map(function (n, i) {
    var cls = i < current ? ' fm-step-done' : i === current ? ' fm-step-now' : '';
    return '<li class="fm-step' + cls + '"' + (i === current ? ' aria-current="step"' : '') + '><span class="fm-step-n">' + (i < current ? icon('check') : (i + 1)) + '</span><span class="fm-step-name">' + esc(n) + '</span></li>';
  }).join('') + '</ol></div>';
}

function fmAnswersList(spec, answers, withEdit) {
  var html = '';
  spec.steps.forEach(function (s, i) {
    var rows = s.fields.filter(function (f) { return f.type !== 'note' && fmShown(f, answers); }).map(function (f) {
      var v = fmDisplay(f, answers[f.name]);
      return '<div class="fm-row"><dt>' + esc(L(f.label)) + '</dt><dd>' + (v ? esc(v) : '<span class="muted">' + t('fm_not_answered') + '</span>') + '</dd></div>';
    }).join('');
    html += '<section class="fm-review-step" aria-labelledby="fm-rv-' + i + '"><div class="section-head"><h3 id="fm-rv-' + i + '">' + esc(L(s.title)) + '</h3>' +
      (withEdit ? '<button type="button" class="btn btn-sm" data-act="fmEdit" data-id="' + spec.id + '" data-step="' + i + '">' + icon('edit') + t('fm_edit') + '<span class="sr-only"> ' + esc(L(s.title)) + '</span></button>' : '') + '</div>' +
      '<dl class="fm-dl">' + rows + '</dl></section>';
  });
  if (spec.computed) {
    var comp = spec.computed(answers);
    if (comp.length) html += '<dl class="fm-dl fm-dl-computed">' + comp.map(function (c) { return '<div class="fm-row"><dt>' + esc(L(c.label)) + '</dt><dd><strong>' + esc(c.value) + '</strong></dd></div>'; }).join('') + '</dl>';
  }
  return html;
}

function fmIntroBlocks(spec) {
  var html = '';
  if (spec.fee) html += '<div class="callout callout-gold fm-callout"><p><strong>' + t('fm_fee_h') + '.</strong> ' + esc(L(spec.fee)) + '</p></div>';
  if (spec.deadline) html += '<div class="callout callout-pine fm-callout"><p><strong>' + t('fm_deadline_h') + '.</strong> ' + esc(L(spec.deadline)) + '</p></div>';
  if (spec.attachments && spec.attachments.length) html += '<div class="callout fm-callout"><p><strong>' + t('fm_bring_h') + '</strong></p><ul class="prose">' + spec.attachments.map(function (a) { return '<li>' + esc(L(a)) + '</li>'; }).join('') + '</ul></div>';
  if (spec.sensitive) html += '<div class="callout fm-callout"><p><strong>' + t('fm_sensitive_h') + '.</strong> ' + esc(L(spec.sensitive)) + '</p></div>';
  return html;
}

function fmSuccess(spec, tk) {
  var a = tk.form.answers;
  return '<div class="card fm-success" role="status" tabindex="-1" id="fm-success">' +
    '<p class="eyebrow">' + t('fm_done_eyebrow') + '</p>' +
    '<h2>' + esc(t('fm_done_title', { title: L(spec.title) })) + '</h2>' +
    '<p class="fm-ref-label">' + t('fm_done_ref') + '</p><p class="fm-ref">' + esc(tk.ref) + '</p>' +
    '<p>' + t('fm_done_keep') + '</p>' +
    '<h3>' + t('fm_done_next_h') + '</h3><ol class="fm-next"><li>' + esc(t('fm_done_routed', { dept: deptName(tk.dept) })) + '</li><li>' + esc(t('fm_done_time')) + '</li></ol>' +
    '<div class="cluster">' + link('track', tk.ref, icon('search') + t('fm_done_track'), 'btn btn-primary') + link('forms', '', t('fm_done_hub'), 'btn') +
    '<button type="button" class="btn btn-ghost" data-act="fmAgain" data-id="' + spec.id + '">' + t('fm_done_another') + '</button></div></div>' +
    '<section class="fm-copy" aria-labelledby="fm-copy-h"><div class="section-head"><h2 id="fm-copy-h">' + t('fm_done_copy_h') + '</h2></div><p class="muted">' + t('fm_done_copy_p') + '</p>' +
    '<div class="card fm-sheet"><p class="eyebrow">' + esc(t('site_name')) + '</p><h3>' + esc(L(spec.title)) + '</h3><p class="small muted"><span class="ref">' + esc(tk.ref) + '</span> · ' + esc(fmtDateTime(tk.created)) + '</p>' +
    fmAnswersList(spec, a, false) +
    (tk.form.signed ? '<p class="fm-signed">' + icon('check') + ' ' + esc(t('fm_signed_by', { name: tk.form.signed.name, date: fmtDate(tk.form.signed.date, 'long') })) + '</p>' : '') + '</div></section>';
}

views.form = {
  section: 'services',
  title: function (arg) { var s = fmSpec(arg); return s ? L(s.title) : t('fm_hub_title'); },
  render: function (arg) {
    var spec = fmSpec(arg);
    if (!spec) return views.forms.render();
    var st = fmState(spec.id);
    var total = spec.steps.length, hasSign = !!spec.signText;
    var head = pageHead({ crumbs: [['home', t('nav_home')], ['forms', t('fm_hub_title')]], eyebrow: t('fm_eyebrow'), title: L(spec.title), lead: L(spec.intro),
      aside: '<p class="cluster fm-meta"><span class="tag tag-pine">' + icon('route') + esc(t('fm_goes_to')) + ' ' + esc(deptName(spec.dept)) + '</span><span class="tag tag-muted">' + icon('clock') + esc(t('fm_takes', { n: spec.minutes })) + '</span></p>' });
    var body;
    if (st.done) {
      body = fmSuccess(spec, st.done);
    } else if (st.step >= total) {
      var sign = hasSign ? '<fieldset class="fm-sign"><legend>' + t('fm_sign_h') + '</legend><blockquote class="fm-sign-text"><p>' + esc(L(spec.signText)) + '</p></blockquote><p class="small">' + esc(t('fm_sign_p')) + '</p>' +
        '<div class="form-grid"><div class="field"><label for="fm-sign-name">' + t('fm_sign_name') + ' <span class="req" aria-hidden="true">*</span><span class="sr-only"> ' + t('required') + '</span></label><input class="input fm-sign-input" type="text" id="fm-sign-name" name="sign_name" autocomplete="name" aria-required="true" value="' + esc(st.answers.sign_name || '') + '"><p class="err" data-err="sign_name" hidden></p></div>' +
        '<div class="field"><span class="label">' + t('fm_sign_date') + '</span><p class="fm-sign-date">' + esc(fmtDate(todayISO(), 'long')) + '</p></div></div>' +
        '<div class="field"><label class="check" for="fm-sign-agree"><input type="checkbox" id="fm-sign-agree" name="sign_agree" value="yes" aria-required="true"><span>' + t('fm_sign_agree') + '</span></label><p class="err" data-err="sign_agree" hidden></p></div></fieldset>' : '';
      body = fmStepList(spec, total, hasSign) +
        '<form data-form="fmSubmit" data-id="' + spec.id + '" class="card fm-form stack" novalidate aria-labelledby="fm-step-h">' +
        '<div data-errsummary tabindex="-1" class="callout callout-red" hidden></div>' +
        '<p class="eyebrow">' + esc(t('fm_step_of', { n: total + 1, total: total + 1 })) + '</p><h2 id="fm-step-h" tabindex="-1">' + (hasSign ? t('fm_review') : t('fm_review_only')) + '</h2>' +
        fmAnswersList(spec, st.answers, true) + sign + formNotes() +
        '<div class="cluster fm-nav"><button type="button" class="btn" data-act="fmBack" data-id="' + spec.id + '">' + icon('back') + t('fm_back') + '</button><button type="submit" class="btn btn-primary btn-lg">' + icon('send') + t('fm_submit') + '</button></div></form>';
    } else {
      var step = spec.steps[st.step];
      var fields = step.fields.filter(function (f) { return fmShown(f, st.answers); }).map(function (f) { return fmControl(f, 'fm-' + f.name, st.answers[f.name], st.answers); }).join('');
      body = fmStepList(spec, st.step, hasSign) +
        '<form data-form="fmStep" data-id="' + spec.id + '" data-input="fmDraft" data-change="fmLive" class="card fm-form stack" novalidate aria-labelledby="fm-step-h">' +
        '<div data-errsummary tabindex="-1" class="callout callout-red" hidden></div>' +
        '<p class="eyebrow">' + esc(t('fm_step_of', { n: st.step + 1, total: total + 1 })) + '</p><h2 id="fm-step-h" tabindex="-1">' + esc(L(step.title)) + '</h2>' +
        (step.note ? '<p class="muted">' + esc(L(step.note)) + '</p>' : '') +
        '<p class="small muted">' + t('pb_req_note') + '</p>' +
        '<div class="form-grid">' + fields + '</div>' +
        '<div class="cluster fm-nav">' + (st.step > 0 ? '<button type="button" class="btn" data-act="fmBack" data-id="' + spec.id + '">' + icon('back') + t('fm_back') + '</button>' : '') +
        '<button type="submit" class="btn btn-primary btn-lg">' + (st.step === total - 1 ? t('fm_to_review') : t('fm_continue')) + ' ' + icon('arrow') + '</button></div></form>';
    }
    var draftNote = st.done ? '' : '<p class="small muted fm-draft">' + icon('lock') + ' ' + (st.restored ? esc(t('fm_draft_found')) + ' ' : '') + esc(t('fm_draft_saved')) +
      ' <button type="button" class="btn-plain" data-act="fmClear" data-id="' + spec.id + '">' + t('fm_clear') + '</button></p>';
    return head + '<div class="wrap"><div class="split fm-split"><div class="main stack">' + body + draftNote + '</div>' +
      '<aside class="side stack">' + fmIntroBlocks(spec) + '<div class="card"><p>' + extLink(spec.source, /\.docx$/i.test(spec.source) ? t('fm_word') : t('fm_pdf')) + '</p></div>' + humanStrip() + '</aside></div></div>';
  },
  after: function (arg) {
    var st = U.v.forms && U.v.forms[arg];
    if (!st || !st.focusNext) return;
    st.focusNext = false;
    var el = document.getElementById(st.done ? 'fm-success' : 'fm-step-h');
    if (el) { el.focus(); if (el.scrollIntoView) el.scrollIntoView({ block: 'start' }); }
  }
};

on.submit.fmStep = function (form) {
  var spec = fmSpec(form.getAttribute('data-id'));
  if (!spec) return;
  var st = fmState(spec.id);
  fmCollect(form, spec, st.step, st.answers);
  if (validate(form, fmRules(spec, st.step, st.answers)).length) return;
  st.step += 1;
  st.restored = false;
  st.focusNext = true;
  fmSaveDraft(spec.id);
  rerender();
  announce(t('fm_step_saved', { step: t('fm_step_of', { n: st.step + 1, total: spec.steps.length + 1 }) }));
};
on.click.fmBack = function (el) {
  var spec = fmSpec(el.getAttribute('data-id'));
  var st = fmState(spec.id);
  var form = closest(el, 'form');
  if (form && st.step < spec.steps.length) fmCollect(form, spec, st.step, st.answers);
  st.step = Math.max(0, st.step - 1);
  st.focusNext = true;
  fmSaveDraft(spec.id);
  rerender();
};
on.click.fmEdit = function (el) {
  var spec = fmSpec(el.getAttribute('data-id'));
  var st = fmState(spec.id);
  st.step = Number(el.getAttribute('data-step')) || 0;
  st.focusNext = true;
  fmSaveDraft(spec.id);
  rerender();
};
on.click.fmClear = function (el) {
  var id = el.getAttribute('data-id');
  fmClearDraft(id);
  rerender();
  toast(t('fm_cleared'), 'ok');
  var h = document.getElementById('fm-step-h');
  if (h) h.focus();
};
on.click.fmAgain = function (el) {
  var id = el.getAttribute('data-id');
  fmClearDraft(id);
  rerender();
  var h = document.getElementById('fm-step-h');
  if (h) h.focus();
};
/* Keeps the draft current while typing. */
on.input.fmDraft = function (form) {
  var spec = fmSpec(form.getAttribute('data-id'));
  if (!spec) return;
  var st = fmState(spec.id);
  fmCollect(form, spec, st.step, st.answers);
  fmSaveDraft(spec.id);
};
/* A choice that other questions depend on redraws the step. */
on.change.fmLive = function (form, e) {
  var spec = fmSpec(form.getAttribute('data-id'));
  if (!spec) return;
  var st = fmState(spec.id);
  fmCollect(form, spec, st.step, st.answers);
  fmSaveDraft(spec.id);
  var name = e && e.target && e.target.name;
  var dependent = spec.steps[st.step].fields.some(function (f) { return f.when && f.when.name === name; });
  if (dependent) rerender();
};

function fmSummaryText(spec, a) {
  var parts = [];
  spec.steps.forEach(function (s) {
    s.fields.forEach(function (f) {
      if (!fmShown(f, a) || f.type === 'file') return;
      var v = fmDisplay(f, a[f.name]);
      if (v) parts.push(f.label.en + ': ' + v);
    });
  });
  var text = spec.title.en + '. ' + parts.join('; ');
  return text.length > 900 ? text.slice(0, 897) + '…' : text;
}
function fmRole(spec, a, role) {
  var out = [];
  spec.steps.forEach(function (s) { s.fields.forEach(function (f) { if (f.role === role && a[f.name]) out.push(a[f.name]); }); });
  return out.join(', ');
}

on.submit.fmSubmit = function (form) {
  var spec = fmSpec(form.getAttribute('data-id'));
  if (!spec) return;
  var st = fmState(spec.id);
  var rules = spec.signText ? [{ name: 'sign_name', required: true, min: 3, msg: t('fm_err_sign_name') }, { name: 'sign_agree', required: true, msg: t('fm_err_sign_agree') }] : [];
  if (validate(form, rules).length) return;
  var answers = {};
  Object.keys(st.answers).forEach(function (k) { if (k !== 'sign_name') answers[k] = st.answers[k]; });
  var tk = openTicket({ cat: spec.cat, dept: spec.dept, source: 'form', text: fmSummaryText(spec, answers),
    name: fmRole(spec, answers, 'name'), contact: fmRole(spec, answers, 'contact'), where: fmRole(spec, answers, 'where') });
  tk.form = { id: spec.id, answers: answers };
  if (spec.signText) tk.form.signed = { name: form.elements.sign_name.value.trim(), date: todayISO() };
  save();
  fmClearDraft(spec.id);
  var fresh = fmState(spec.id);
  fresh.done = tk;
  fresh.focusNext = true;
  rerender();
  toast(t('fm_toast_sent', { ref: tk.ref }), 'ok');
};

/* Hub */
views.forms = {
  section: 'services',
  title: function () { return t('fm_hub_title'); },
  render: function () {
    var cards = FORMS.map(function (f) {
      return '<li class="card fm-card"><div class="fm-card-body"><h2 class="fm-card-title">' + link('form', f.id, esc(L(f.title))) + '</h2><p>' + esc(L(f.purpose)) + '</p>' +
        '<p class="cluster small fm-card-meta"><span class="tag tag-pine">' + icon('route') + esc(t('fm_goes_to')) + ' ' + esc(deptName(f.dept)) + '</span><span class="tag tag-muted">' + icon('clock') + esc(t('fm_takes', { n: f.minutes })) + '</span>' +
        (f.fee ? '<span class="tag tag-gold">' + icon('bill') + esc(t('fm_fee_h')) + '</span>' : '') + '</p></div>' +
        '<div class="fm-card-actions">' + link('form', f.id, icon('edit') + t('fm_fill'), 'btn btn-primary') + extLink(f.source, /\.docx$/i.test(f.source) ? t('fm_word') : t('fm_pdf'), 'btn') + '</div></li>';
    }).join('');
    var sampleMap = { d5: ['form', 'business-license'], d6: ['form', 'zoning-permit'], d7: ['form', 'water-service'], d12: ['records', ''] };
    var samples = S.docs.filter(function (d) { return d.online && sampleMap[d.id]; }).map(function (d) {
      var tgt = sampleMap[d.id];
      return '<li>' + link(tgt[0], tgt[1], esc(d.title)) + '</li>';
    }).join('');
    return pageHead({ crumbs: [['home', t('nav_home')], ['services', t('nav_services')]], eyebrow: t('fm_hub_eyebrow'), title: t('fm_hub_title'), lead: t('fm_hub_lead'),
      aside: '<p class="tag tag-muted">' + esc(t('fm_hub_count', { n: FORMS.length })) + '</p>' }) +
      '<div class="wrap"><div class="split fm-split"><div class="main"><ul class="plain fm-cards">' + cards + '</ul></div>' +
      '<aside class="side stack"><div class="card"><h2 class="fm-side-h">' + t('fm_how_h') + '</h2><ol class="prose fm-how"><li>' + t('fm_how_1') + '</li><li>' + t('fm_how_2') + '</li><li>' + t('fm_how_3') + '</li><li>' + t('fm_how_4') + '</li></ol></div>' +
      (samples ? '<div class="card"><h2 class="fm-side-h">' + t('fm_also_h') + ' ' + sampleTag() + '</h2><p class="small muted">' + t('fm_also_p') + '</p><ul class="prose">' + samples + '</ul></div>' : '') +
      '<div class="card"><p>' + link('documents', '', t('dc_title'), 'btn') + '</p></div>' + humanStrip() + '</aside></div></div>';
  }
};

/* Town Desk: form submissions */
function fmTickets() { return S.tickets.filter(function (x) { return x.form && fmSpec(x.form.id); }); }

desk.deskforms = {
  title: function () { return 'Form submissions'; },
  render: function (arg) {
    var st = tdState('deskforms', { filter: 'all', print: false });
    var all = fmTickets();
    var list = all.filter(function (x) { return st.filter === 'all' || x.form.id === st.filter; });
    var chips = '<button type="button" class="chip" data-act="fmDeskFilter" data-val="all" aria-pressed="' + (st.filter === 'all' ? 'true' : 'false') + '">All <span class="pb-count">' + all.length + '</span></button>' +
      FORMS.map(function (f) {
        var n = all.filter(function (x) { return x.form.id === f.id; }).length;
        return n ? '<button type="button" class="chip" data-act="fmDeskFilter" data-val="' + f.id + '" aria-pressed="' + (st.filter === f.id ? 'true' : 'false') + '">' + esc(f.title.en) + ' <span class="pb-count">' + n + '</span></button>' : '';
      }).join('');
    var rows = list.length ? '<ul class="plain td-tickets">' + list.map(function (x) {
      var spec = fmSpec(x.form.id);
      return '<li>' + link('deskforms', x.ref, '<span class="td-tk-top"><span class="ref">' + esc(x.ref) + '</span>' + tdStatusPill(x.status) + (x.lang === 'es' ? '<span class="tag tag-pine">Spanish</span>' : '') + '</span>' +
        '<span class="td-tk-text">' + esc(spec.title.en) + '</span>' +
        '<span class="small muted">' + esc(x.name || 'No name given') + (x.where ? ' · ' + esc(x.where.split('\n')[0]) : '') + ' · ' + esc(deptName(x.dept)) + ' · ' + esc(ago(x.created)) + '</span>', 'td-tk' + (x.ref === arg ? ' td-tk-current' : ''), x.ref === arg ? 'aria-current="true"' : '') + '</li>';
    }).join('') + '</ul>' : '<p class="empty">No form submissions yet. Fill one out on the public site and it shows up here.</p>';
    var tk = arg ? findTicket(arg) : null;
    var detail = tk && tk.form && fmSpec(tk.form.id) ? (st.print && st.print === tk.ref ? fmDeskPrint(tk) : fmDeskDetail(tk)) : '<div class="empty td-detail-empty"><p>Pick a submission to read the answers.</p></div>';
    return tdHead('Form submissions', 'Every online form arrives here with all its answers. Replies and status changes show the resident under Track a request.') +
      '<div class="td-help"><div class="td-queue"><div role="group" aria-label="Filter by form" class="cluster fm-desk-chips">' + chips + '</div>' + rows + '</div><div class="td-detail">' + detail + '</div></div>';
  },
  after: function (arg) { if (arg) { var el = document.getElementById('td-detail-h'); if (el) el.focus(); } }
};

function fmDeskDetail(tk) {
  var spec = fmSpec(tk.form.id);
  var timeline = '<ol class="timeline">' + tk.timeline.map(function (e) {
    return '<li><p class="when">' + esc(fmtDateTime(e.t)) + ' · ' + (e.who === 'staff' ? 'Staff' : e.who === 'system' ? 'System' : 'Resident') + '</p><p>' + esc(entryText(e)) + '</p></li>';
  }).join('') + '</ol>';
  var meta = '<dl class="kicker-list small td-meta"><dt>From</dt><dd>' + esc(tk.name || 'Not given') + (tk.contact ? ', ' + esc(tk.contact) : '') + '</dd>' +
    '<dt>Received</dt><dd>' + esc(fmtDateTime(tk.created)) + (tk.lang === 'es' ? ' (filled out in Spanish)' : '') + '</dd>' +
    '<dt>Department</dt><dd>' + esc(deptName(tk.dept)) + '</dd>' +
    (tk.form.signed ? '<dt>Signed</dt><dd>' + esc(tk.form.signed.name) + ', ' + esc(fmtDate(tk.form.signed.date, 'long')) + '</dd>' : '') +
    '<dt>Paper form</dt><dd>' + extLink(spec.source, 'Original on keysvilleva.gov') + '</dd></dl>';
  var actions = tk.status === 'resolved' ? '<p class="callout callout-pine">Resolved.</p>' :
    '<div class="cluster">' + (tk.status === 'new' ? '<button type="button" class="btn btn-primary" data-act="fmDeskReceived" data-ref="' + esc(tk.ref) + '">' + icon('check') + 'Mark received</button>' : '') +
    '<button type="button" class="btn" data-act="fmDeskPrint" data-ref="' + esc(tk.ref) + '">' + icon('doc') + 'Print view</button>' +
    link('deskhelp', tk.ref, icon('chat') + 'Open in Help desk', 'btn') + '</div>' +
    '<form data-form="fmDeskInfo" class="stack fm-desk-info" novalidate><input type="hidden" name="ref" value="' + esc(tk.ref) + '">' + pbErrSummary() +
    '<h3>Needs more info</h3>' + tdField({ id: 'fm-info-text', name: 'text', label: 'What do you need from the applicant?', type: 'textarea', rows: 3, required: true, hint: 'Posted under their reference number. The status changes to Waiting on resident.' }) +
    '<div><button type="submit" class="btn">' + icon('send') + 'Ask for it</button></div></form>';
  return '<div class="card td-detail-card"><h2 id="td-detail-h" tabindex="-1" class="td-h2"><span class="ref">' + esc(tk.ref) + '</span> ' + tdStatusPill(tk.status) + '</h2>' +
    '<p class="fm-desk-title">' + esc(spec.title.en) + '</p>' + meta +
    '<h3>Answers</h3>' + fmAnswersList(spec, tk.form.answers, false) +
    '<h3>Actions</h3>' + actions + '<h3>Timeline</h3>' + timeline + '</div>';
}

function fmDeskPrint(tk) {
  var spec = fmSpec(tk.form.id);
  return '<div class="card fm-sheet fm-sheet-desk"><p class="cluster"><button type="button" class="btn btn-sm" data-act="fmDeskPrint" data-ref="" >' + icon('back') + 'Back to the submission</button></p>' +
    '<p class="eyebrow">Town of Keysville</p><h2 id="td-detail-h" tabindex="-1">' + esc(spec.title.en) + '</h2>' +
    '<p class="small muted"><span class="ref">' + esc(tk.ref) + '</span> · received ' + esc(fmtDateTime(tk.created)) + ' · ' + esc(deptName(tk.dept)) + '</p>' +
    fmAnswersList(spec, tk.form.answers, false) +
    (tk.form.signed ? '<p class="fm-signed">' + icon('check') + ' Signed by ' + esc(tk.form.signed.name) + ' on ' + esc(fmtDate(tk.form.signed.date, 'long')) + ' (typed signature)</p>' : '') +
    '<div class="fm-office"><p><strong>Office use</strong></p><dl class="kicker-list small"><dt>Received by</dt><dd>' + esc(U.deskUser ? U.deskUser.name : '') + '</dd><dt>Status</dt><dd>' + tdStatusPill(tk.status) + '</dd><dt>Notes</dt><dd>' + esc(tk.timeline.filter(function (e) { return e.who === 'staff'; }).map(function (e) { return e.text; }).join(' / ') || 'None yet') + '</dd></dl></div></div>';
}

on.click.fmDeskFilter = function (el) { tdState('deskforms').filter = el.getAttribute('data-val'); rerender(); };
on.click.fmDeskPrint = function (el) {
  var st = tdState('deskforms');
  st.print = el.getAttribute('data-ref') || false;
  rerender();
  var h = document.getElementById('td-detail-h');
  if (h) h.focus();
};
on.click.fmDeskReceived = function (el) {
  var tk = findTicket(el.getAttribute('data-ref'));
  if (!tk || !tk.form) return;
  tk.status = 'progress';
  tk.timeline.push({ t: Date.now(), who: 'staff', text: 'Application received and under review by ' + deptName(tk.dept) + '.', public: true });
  logAct('Marked form submission ' + tk.ref + ' received');
  save(); rerender(); toast(tk.ref + ' marked received.', 'ok');
};
on.submit.fmDeskInfo = function (form, data) {
  if (pbValidate(form, [{ name: 'text', required: true, msg: 'Say what you need from the applicant.' }]).length) return;
  var tk = findTicket(data.ref);
  if (!tk || !tk.form) return;
  tk.status = 'waiting';
  tk.timeline.push({ t: Date.now(), who: 'staff', text: 'We need a little more before we can go on: ' + data.text.trim(), public: true });
  logAct('Asked for more information on ' + tk.ref);
  save(); rerender(); toast('Posted. The applicant sees it under their reference.', 'ok');
};
