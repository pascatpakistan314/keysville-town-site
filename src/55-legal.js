/* Legal and policy pages. One view, one page per arg. The English text is the
   official version; the Spanish pages say so. */

var LEGAL_ORDER = ['privacy', 'cookies', 'foia', 'nondiscrimination', 'language', 'terms', 'records', 'security', 'comment', 'about'];

var LEGAL = {
  privacy: {
    title: ['Privacy statement', 'Declaración de privacidad'],
    body: [
      '<p>The Town of Keysville respects your privacy. This page explains what this website collects and how we use it. It is posted under Virginia Code § 2.2-3803.</p>' +
      '<h2>What we collect automatically</h2><p>Our web server records the date and time of your visit, the pages you viewed, your browser type and your IP address. We use these logs to keep the site running and secure. Logs are kept for [90] days and then deleted. We do not use analytics or advertising services that track you.</p>' +
      '<h2>What our forms collect</h2><p>When you fill out a form, such as a contact form, a service request or a records request, we collect only what the form asks for. This is usually your name, phone number, email address and your message. We use it to answer you and to carry out the business you asked about. Submissions go to the staff member who handles that service and are kept as town records under the Virginia Public Records Act and the Library of Virginia retention schedule that applies, then destroyed.</p>' +
      '<h2>Cookies and storage</h2><p>This site sets no tracking or advertising cookies. It stores only small preference settings on your device, such as text size, language or a notice you closed. See the ' + link('legal', 'cookies', 'cookie notice') + '.</p>' +
      '<h2>Who sees your information</h2><p>Town staff who need it to do their work. We do not sell or rent personal information. Records may be released under the Virginia Freedom of Information Act unless an exemption applies, and we may share information when the law requires it.</p>' +
      '<h2>Children</h2><p>This site is not directed to children and we do not knowingly collect information from anyone under 13.</p>' +
      '<h2>Links to other sites</h2><p>Other websites have their own privacy practices. We are not responsible for them.</p>' +
      '<h2>Questions</h2><p>Contact the Town Clerk at 434-736-9551 or write to Town of Keysville, P.O. Box 42, Keysville, VA 23947.</p>',
      '<p>El pueblo de Keysville respeta su privacidad. Esta página explica qué recopila este sitio web y cómo lo usamos. Se publica conforme al Código de Virginia § 2.2-3803.</p>' +
      '<h2>Lo que recopilamos automáticamente</h2><p>Nuestro servidor registra la fecha y hora de su visita, las páginas que vio, el tipo de navegador y su dirección IP. Usamos estos registros para mantener el sitio funcionando y seguro. Se conservan [90] días y luego se borran. No usamos servicios de análisis ni de publicidad que lo rastreen.</p>' +
      '<h2>Lo que recopilan nuestros formularios</h2><p>Cuando llena un formulario, como un mensaje de contacto, una solicitud de servicio o una solicitud de registros, recopilamos solo lo que el formulario pide: normalmente su nombre, teléfono, correo electrónico y su mensaje. Lo usamos para responderle y atender lo que solicitó. Los envíos van al empleado que atiende ese servicio y se conservan como registros del pueblo según la Ley de Registros Públicos de Virginia y el calendario de retención de la Biblioteca de Virginia que corresponda; después se destruyen.</p>' +
      '<h2>Cookies y almacenamiento</h2><p>Este sitio no coloca cookies de rastreo ni de publicidad. Solo guarda pequeñas preferencias en su dispositivo, como el tamaño del texto, el idioma o un aviso que cerró. Vea el ' + link('legal', 'cookies', 'aviso de cookies') + '.</p>' +
      '<h2>Quién ve su información</h2><p>El personal del pueblo que la necesita para su trabajo. No vendemos ni alquilamos información personal. Los registros pueden divulgarse según la Ley de Libertad de Información de Virginia salvo que aplique una exención, y podemos compartir información cuando la ley lo exija.</p>' +
      '<h2>Menores</h2><p>Este sitio no está dirigido a niños y no recopilamos a sabiendas información de menores de 13 años.</p>' +
      '<h2>Enlaces a otros sitios</h2><p>Otros sitios web tienen sus propias prácticas de privacidad. No somos responsables de ellas.</p>' +
      '<h2>Preguntas</h2><p>Comuníquese con la Secretaría Municipal al 434-736-9551 o escriba a Town of Keysville, P.O. Box 42, Keysville, VA 23947.</p>'
    ]
  },
  cookies: {
    title: ['Cookie notice', 'Aviso de cookies'],
    body: [
      '<p>This site does not use tracking, analytics or advertising cookies, and it does not share your activity with anyone. Because of that, we do not show a cookie consent banner; there is nothing to consent to.</p>' +
      '<p>The site uses only functional browser storage to remember choices you make here, such as a closed alert, your language, or your text size and contrast settings. That storage stays on your device and is never sent to us. You can clear it at any time in your browser settings, or with the accessibility panel.</p>' +
      '<p>If the town ever adds a tool that tracks visitors, we will update this notice and the ' + link('legal', 'privacy', 'privacy statement') + ' first.</p>',
      '<p>Este sitio no usa cookies de rastreo, análisis ni publicidad, y no comparte su actividad con nadie. Por eso no mostramos un aviso de consentimiento de cookies: no hay nada que consentir.</p>' +
      '<p>El sitio usa solo almacenamiento funcional del navegador para recordar las opciones que usted elige aquí, como un aviso que cerró, su idioma, o el tamaño del texto y el contraste. Ese almacenamiento se queda en su dispositivo y nunca se nos envía. Puede borrarlo en cualquier momento desde la configuración de su navegador o desde el panel de accesibilidad.</p>' +
      '<p>Si el pueblo alguna vez agrega una herramienta que rastree visitantes, actualizaremos primero este aviso y la ' + link('legal', 'privacy', 'declaración de privacidad') + '.</p>'
    ]
  },
  foia: {
    title: ['Your rights under Virginia FOIA', 'Sus derechos bajo la ley FOIA de Virginia'],
    body: [
      '<p>The Virginia Freedom of Information Act (FOIA), Virginia Code § 2.2-3700 and following, gives you the right to see public records held by the Town of Keysville and to attend its public meetings. This notice is posted under § 2.2-3704.1. The ' + link('records', '', 'public records page') + ' has the request form.</p>' +
      '<h2>Your rights</h2><ul><li>Any Virginia resident, and any news organization that circulates in Virginia, may ask for town records.</li><li>You do not have to say why you want them or use a special form.</li><li>You may ask for records in any format we keep them in, including electronic.</li><li>You may attend any public meeting of the Town Council and its boards, and speak during public comment.</li></ul>' +
      '<h2>Our responsibilities</h2><ul><li>We respond within five working days. If we need more time, we tell you in writing and take up to seven more working days.</li><li>We release any part of a record that is not exempt, even when part of it is.</li><li>We tell you in writing which exemption we rely on if we withhold anything.</li><li>We post meeting notices at least three working days ahead, and approved minutes within seven working days of approval.</li></ul>' +
      '<h2>FOIA officer</h2><p>The Town Clerk is the town’s FOIA officer. Town of Keysville, 120 J Street (mail: P.O. Box 42), Keysville, VA 23947. Phone 434-736-9551, Monday to Friday, 8:30 a.m. to 3:00 p.m.</p>' +
      '<h2>Records we keep</h2><p>Council and board minutes and agendas; ordinances and resolutions; budgets and audits; water and sewer billing records; zoning and permit files; business license records; contracts and bids; personnel files; and correspondence.</p>' +
      '<h2>Records we may withhold</h2><p>FOIA lets the town withhold some records, including personnel records (§ 2.2-3705.1), attorney–client and legal records, certain real estate negotiation records, and records whose release would compromise security. The town has no policy of routinely withholding any class of record.</p>' +
      '<h2>Charges</h2><p>A public body may make reasonable charges not to exceed its actual cost incurred in accessing, duplicating, supplying, or searching for the requested records. No public body shall impose any extraneous, intermediary, or surplus fees or expenses to recoup the general costs associated with creating or maintaining records or transacting the general business of the public body. Any duplicating fee shall not exceed the actual cost of duplication. You may ask for a cost estimate before we begin, and we will tell you in advance if a charge is likely. Current fees: staff time at the hourly rate of the lowest-paid employee able to do the work, [$ per hour]; copies [$ per page]; no charge for requests under [$ amount].</p>' +
      '<h2>Help and complaints</h2><p>The Virginia Freedom of Information Advisory Council answers questions and issues advisory opinions: foiacouncil@dls.virginia.gov, 804-698-1810, toll free 1-866-448-4100. You may also tell the Council how we handled your request through its public comment form at ' + extLink('https://foiacouncil.dls.virginia.gov', 'foiacouncil.dls.virginia.gov') + '. If you believe your rights were violated, you may petition the general district or circuit court.</p>',
      '<p>La Ley de Libertad de Información de Virginia (FOIA), Código de Virginia § 2.2-3700 y siguientes, le da derecho a ver los registros públicos del pueblo de Keysville y a asistir a sus reuniones públicas. Este aviso se publica conforme al § 2.2-3704.1. La ' + link('records', '', 'página de registros públicos') + ' tiene el formulario de solicitud. La versión oficial de este aviso es la versión en inglés.</p>' +
      '<h2>Sus derechos</h2><ul><li>Cualquier residente de Virginia, y cualquier medio de noticias que circule en Virginia, puede pedir registros del pueblo.</li><li>No tiene que decir para qué los quiere ni usar un formulario especial.</li><li>Puede pedir los registros en cualquier formato en que los conservemos, incluido el electrónico.</li><li>Puede asistir a cualquier reunión pública del Concejo Municipal y sus juntas, y hablar durante el comentario público.</li></ul>' +
      '<h2>Nuestras responsabilidades</h2><ul><li>Respondemos en cinco días hábiles. Si necesitamos más tiempo, se lo decimos por escrito y tomamos hasta siete días hábiles más.</li><li>Entregamos cualquier parte de un registro que no esté exenta, aunque otra parte lo esté.</li><li>Le indicamos por escrito qué exención aplicamos si retenemos algo.</li><li>Publicamos los avisos de reuniones con al menos tres días hábiles de anticipación, y las actas aprobadas dentro de los siete días hábiles siguientes a su aprobación.</li></ul>' +
      '<h2>Oficial de FOIA</h2><p>La Secretaria Municipal es la oficial de FOIA del pueblo. Town of Keysville, 120 J Street (correo: P.O. Box 42), Keysville, VA 23947. Teléfono 434-736-9551, de lunes a viernes, de 8:30 a.m. a 3:00 p.m.</p>' +
      '<h2>Registros que conservamos</h2><p>Actas y agendas del Concejo y las juntas; ordenanzas y resoluciones; presupuestos y auditorías; registros de facturación de agua y alcantarillado; expedientes de zonificación y permisos; licencias de negocio; contratos y licitaciones; expedientes de personal; y correspondencia.</p>' +
      '<h2>Registros que podemos retener</h2><p>La ley permite retener algunos registros, incluidos expedientes de personal (§ 2.2-3705.1), registros legales y de abogado–cliente, ciertos registros de negociación de bienes inmuebles y registros cuya divulgación comprometería la seguridad. El pueblo no tiene una política de retener de forma rutinaria ninguna clase de registro.</p>' +
      '<h2>Cargos</h2><p>El pueblo puede cobrar cargos razonables que no excedan su costo real de acceder, duplicar, suministrar o buscar los registros solicitados, sin cargos adicionales para recuperar los costos generales de crear o mantener registros. Puede pedir un estimado de costo antes de que empecemos. Tarifas actuales: tiempo del personal a la tarifa por hora del empleado de menor salario capaz de hacer el trabajo, [$ por hora]; copias [$ por página]; sin cargo para solicitudes menores de [$ monto].</p>' +
      '<h2>Ayuda y quejas</h2><p>El Consejo Asesor de FOIA de Virginia responde preguntas y emite opiniones: foiacouncil@dls.virginia.gov, 804-698-1810, gratis 1-866-448-4100. También puede contarle al Consejo cómo atendimos su solicitud en ' + extLink('https://foiacouncil.dls.virginia.gov', 'foiacouncil.dls.virginia.gov') + '. Si cree que se violaron sus derechos, puede presentar una petición ante el tribunal de distrito general o de circuito.</p>'
    ]
  },
  nondiscrimination: {
    title: ['Nondiscrimination and ADA notice', 'Aviso de no discriminación y ADA'],
    body: [
      '<p>The Town of Keysville does not discriminate on the basis of disability, race, color, national origin, sex, religion or age in its programs, services or activities. This notice is posted under 28 CFR § 35.106 and Title VI of the Civil Rights Act of 1964.</p>' +
      '<h2>Reasonable accommodations</h2><p>If you need a sign language interpreter, materials in another format, assistive listening, or another accommodation to take part in a town meeting or service, contact the ADA coordinator at least two working days before the event when possible. [ADA coordinator name and title], 434-736-9551, 711 (Virginia Relay), 120 J Street, P.O. Box 42, Keysville, VA 23947. You can also use the ' + link('accessibility', 'request', 'accommodation request form') + '. Accommodations are free.</p>' +
      '<h2>Complaints</h2><ol><li>File a written complaint with the ADA coordinator within 60 days of the problem. Include your name, how to reach you and what happened. We can take it by phone or in person if writing is hard for you.</li><li>We meet with you or call you within 15 days.</li><li>We answer in writing within 30 days, in a format that works for you.</li><li>You may also file with the U.S. Department of Justice at ' + extLink('https://www.ada.gov', 'ada.gov') + ' at any time. You do not have to use our process first.</li></ol>' +
      '<p>The town will not retaliate against anyone who asks for an accommodation or makes a complaint.</p>',
      '<p>El pueblo de Keysville no discrimina por discapacidad, raza, color, origen nacional, sexo, religión ni edad en sus programas, servicios o actividades. Este aviso se publica conforme a 28 CFR § 35.106 y al Título VI de la Ley de Derechos Civiles de 1964.</p>' +
      '<h2>Adaptaciones razonables</h2><p>Si necesita un intérprete de lengua de señas, materiales en otro formato, equipo de audición asistida u otra adaptación para participar en una reunión o servicio del pueblo, comuníquese con el coordinador de la ADA con al menos dos días hábiles de anticipación cuando sea posible. [Nombre y cargo], 434-736-9551, 711 (Virginia Relay), 120 J Street, P.O. Box 42, Keysville, VA 23947. También puede usar el ' + link('accessibility', 'request', 'formulario de solicitud de adaptaciones') + '. Las adaptaciones son gratuitas.</p>' +
      '<h2>Quejas</h2><ol><li>Presente una queja por escrito al coordinador de la ADA dentro de los 60 días del problema. Incluya su nombre, cómo contactarlo y qué pasó. Podemos tomarla por teléfono o en persona si escribir le resulta difícil.</li><li>Nos reunimos con usted o le llamamos dentro de 15 días.</li><li>Respondemos por escrito dentro de 30 días, en un formato que le sirva.</li><li>También puede presentar una queja ante el Departamento de Justicia de EE. UU. en ' + extLink('https://www.ada.gov', 'ada.gov') + ' en cualquier momento. No tiene que usar nuestro proceso primero.</li></ol>' +
      '<p>El pueblo no tomará represalias contra nadie que pida una adaptación o presente una queja.</p>'
    ]
  },
  language: {
    title: ['Language help', 'Ayuda en su idioma'],
    body: [
      '<p>If you do not speak English well, the Town of Keysville will provide a free interpreter for town meetings and services. Call 434-736-9551 at least two working days ahead when possible. Written documents can be translated on request. You will not be charged. Deaf or hard of hearing callers may dial 711 for Virginia Relay.</p>' +
      '<p>This website is published in English and Spanish. When the two differ, the English version is the official one. This notice is provided under Title VI of the Civil Rights Act of 1964.</p>' +
      '<p lang="es"><strong>Ayuda en su idioma.</strong> Si usted no habla bien inglés, el pueblo de Keysville le proporcionará un intérprete gratuito para reuniones y servicios del pueblo. Llame al 434-736-9551 con al menos dos días hábiles de anticipación cuando sea posible. Los documentos escritos se pueden traducir si lo solicita. No se le cobrará.</p>',
      '<p>Si usted no habla bien inglés, el pueblo de Keysville le proporcionará un intérprete gratuito para reuniones y servicios del pueblo. Llame al 434-736-9551 con al menos dos días hábiles de anticipación cuando sea posible. Los documentos escritos se pueden traducir si lo solicita. No se le cobrará. Las personas sordas o con dificultad para oír pueden marcar 711 (Virginia Relay).</p>' +
      '<p>Este sitio web se publica en inglés y español. Cuando los dos difieran, la versión en inglés es la oficial. Este aviso se publica conforme al Título VI de la Ley de Derechos Civiles de 1964.</p>' +
      '<p lang="en"><strong>Language help.</strong> If you do not speak English well, the Town of Keysville will provide a free interpreter for town meetings and services. Call 434-736-9551.</p>'
    ]
  },
  terms: {
    title: ['Terms of use and outside links', 'Términos de uso y enlaces externos'],
    body: [
      '<p>This website is run by the Town of Keysville, Virginia, for public information. We try to keep it accurate and current, but the official record of any ordinance, meeting or policy is the signed document on file at Town Hall. If this site and the official record differ, the record controls.</p>' +
      '<h2>Public information</h2><p>Text written by the town is public information and may be copied with attribution. Photos, logos and the town seal may be subject to other people’s rights or restricted to official use; ask before reusing them.</p>' +
      '<h2>Outside links</h2><p>Links to other websites, including Paymentus, VDOT and Charlotte County, are provided for convenience. The town does not control those sites and does not endorse their content, products or privacy practices. Links to other sites are marked and open in a new tab.</p>' +
      '<h2>No warranty</h2><p>The site is provided as is. The town is not liable for losses from using it or from downtime.</p>' +
      '<h2>Contact</h2><p>Town Clerk, 434-736-9551, P.O. Box 42, Keysville, VA 23947.</p>',
      '<p>Este sitio web lo administra el pueblo de Keysville, Virginia, para información pública. Procuramos mantenerlo exacto y al día, pero el registro oficial de cualquier ordenanza, reunión o política es el documento firmado que se conserva en la Alcaldía. Si este sitio y el registro oficial difieren, el registro prevalece.</p>' +
      '<h2>Información pública</h2><p>El texto escrito por el pueblo es información pública y puede copiarse citando la fuente. Las fotos, los logotipos y el sello del pueblo pueden estar sujetos a derechos de terceros o reservados para uso oficial; pregunte antes de reutilizarlos.</p>' +
      '<h2>Enlaces externos</h2><p>Los enlaces a otros sitios web, incluidos Paymentus, VDOT y el condado de Charlotte, se ofrecen por conveniencia. El pueblo no controla esos sitios ni respalda su contenido, productos o prácticas de privacidad. Los enlaces externos están marcados y se abren en una pestaña nueva.</p>' +
      '<h2>Sin garantía</h2><p>El sitio se ofrece tal como está. El pueblo no es responsable por pérdidas derivadas de su uso o de interrupciones.</p>' +
      '<h2>Contacto</h2><p>Secretaría Municipal, 434-736-9551, P.O. Box 42, Keysville, VA 23947.</p>'
    ]
  },
  records: {
    title: ['How the town keeps records', 'Cómo conserva el pueblo sus registros'],
    body: [
      '<p>Town records are public property. We keep them under the Virginia Public Records Act (Virginia Code § 42.1-76 and following) and the retention schedules the Library of Virginia issues for localities. Our records officer is [name and title].</p>' +
      '<p>Records are destroyed only after their retention period ends, when no audit, lawsuit or records request is pending, and after a Certificate of Records Destruction has been signed. Council minutes and ordinances are kept permanently. Each document on the ' + link('documents', '', 'Documents page') + ' shows its retention period.</p>' +
      '<p>Messages sent through this website, including service requests and the help assistant, are town records and are kept under the same rules.</p>',
      '<p>Los registros del pueblo son propiedad pública. Los conservamos según la Ley de Registros Públicos de Virginia (Código de Virginia § 42.1-76 y siguientes) y los calendarios de retención que la Biblioteca de Virginia emite para las localidades. Nuestro oficial de registros es [nombre y cargo].</p>' +
      '<p>Los registros se destruyen solo después de que termina su periodo de retención, cuando no hay auditoría, demanda ni solicitud de registros pendiente, y tras firmarse un certificado de destrucción. Las actas del Concejo y las ordenanzas se conservan de forma permanente. Cada documento en la ' + link('documents', '', 'página de Documentos') + ' muestra su periodo de retención.</p>' +
      '<p>Los mensajes enviados a través de este sitio, incluidas las solicitudes de servicio y el asistente de ayuda, son registros del pueblo y se conservan bajo las mismas reglas.</p>'
    ]
  },
  security: {
    title: ['Report a security problem', 'Reportar un problema de seguridad'],
    body: [
      '<p>If you find a security weakness in this website or in a town system, please tell us at <span class="mono">security@keysvilleva.gov</span>. Tell us what you found and how to reproduce it.</p>' +
      '<p>Please do not access, change or download data that is not yours, and do not disrupt services. We confirm receipt within three business days and let you know when the issue is fixed. The town will not take legal action against anyone who reports in good faith and follows these rules.</p>' +
      '<p>This address is also listed with the .gov registry as the town’s security contact.</p>',
      '<p>Si encuentra una debilidad de seguridad en este sitio web o en un sistema del pueblo, avísenos a <span class="mono">security@keysvilleva.gov</span>. Díganos qué encontró y cómo reproducirlo.</p>' +
      '<p>No acceda, cambie ni descargue datos que no sean suyos, y no interrumpa los servicios. Confirmamos la recepción en tres días hábiles y le avisamos cuando el problema quede resuelto. El pueblo no tomará acciones legales contra quien reporte de buena fe y siga estas reglas.</p>' +
      '<p>Esta dirección también está registrada en el registro .gov como contacto de seguridad del pueblo.</p>'
    ]
  },
  comment: {
    title: ['How we give notice and take comment', 'Cómo avisamos y recibimos comentarios'],
    body: [
      '<p>Town Council meets the second Monday of each month at 7:00 p.m. at the Town Office, 120 J Street. Notice of every regular, special or emergency meeting is posted on this website, on the bulletin board at Town Hall and in the Clerk’s office at least three working days before the meeting, as Virginia Code § 2.2-3707 requires. The notice gives the date, time and place. The agenda and packet are posted here as soon as they go to council members.</p>' +
      '<h2>Public comment</h2><p>Each regular meeting includes a public comment period. Sign in with the Clerk before the meeting starts. Speakers have [number] minutes. Comments may also be mailed to P.O. Box 42 or sent through the ' + link('contact', '', 'contact form') + ' by [deadline] and will be given to council. Draft minutes are posted within [number] working days and marked as drafts until approved; approved minutes are posted within seven working days of approval.</p>' +
      '<h2>Accommodations</h2><p>Contact the ADA coordinator at 434-736-9551 or 711 at least two working days ahead for an interpreter or other accommodation.</p>',
      '<p>El Concejo Municipal se reúne el segundo lunes de cada mes a las 7:00 p.m. en la Alcaldía, 120 J Street. El aviso de cada reunión ordinaria, extraordinaria o de emergencia se publica en este sitio web, en el tablero de la Alcaldía y en la oficina de la Secretaria al menos tres días hábiles antes de la reunión, como exige el Código de Virginia § 2.2-3707. El aviso indica fecha, hora y lugar. La agenda y el paquete se publican aquí en cuanto se entregan a los concejales.</p>' +
      '<h2>Comentario público</h2><p>Cada reunión ordinaria incluye un periodo de comentario público. Regístrese con la Secretaria antes de que empiece la reunión. Cada persona tiene [número] minutos. También puede enviar comentarios por correo a P.O. Box 42 o mediante el ' + link('contact', '', 'formulario de contacto') + ' antes de [plazo]; se entregarán al Concejo. Las actas en borrador se publican dentro de [número] días hábiles y se marcan como borrador hasta su aprobación; las actas aprobadas se publican dentro de los siete días hábiles siguientes.</p>' +
      '<h2>Adaptaciones</h2><p>Comuníquese con el coordinador de la ADA al 434-736-9551 o al 711 con al menos dos días hábiles de anticipación para un intérprete u otra adaptación.</p>'
    ]
  },
  about: {
    title: ['A letter to the Town of Keysville', 'Una carta al pueblo de Keysville'],
    body: [
      '<p class="lead">To the Mayor, the Town Council and the staff at Town Hall,</p>' +
      '<p>We live and work in Keysville, and we built this on our own time to show what the town’s website could be. Nobody at the town asked for it. We want to be clear about that up front, because we want you to be able to look at it with no obligation and no strings.</p>' +
      '<p>The current site does the basics. What it can’t do is let the clerk post a boil-water notice in two minutes from a phone, let a resident report a pothole and see when it was fixed, let a Spanish-speaking family read the trash schedule, or let someone with low vision find the minutes. This mock-up does those things, and it shows the staff side, which we think is the part that keeps a town site alive after the first month.</p>' +
      '<p>We also went through what Virginia and federal law expect of a town website and built it in: the privacy statement, the FOIA notice, the accessibility statement and accommodation process, the nondiscrimination notice, the language-access notice and a security contact. We would rather the town hear about those from a neighbor than from a complaint.</p>' +
      '<p>Your real documents are here, turned into readable pages, with every original one click away. Your forms can be filled out online. The business directory promotes every licensed business equally. There is a history page we researched and wrote, which the town is welcome to keep whether or not it works with us.</p>' +
      '<p>Everything you type here stays in your browser. Please look around, try to break it, and tell us what we got wrong. We would be glad to sit down with you and walk through it.</p>' +
      '<p>With respect,<br><strong>Winston Marsden</strong><br>Pascat Graphics &amp; Marketing<br>Keysville, Virginia · 434-808-2414</p>' +
      '<hr class="divider">' +
      '<p><strong>This is not the Town of Keysville’s website.</strong> It is a working demonstration built by Pascat Graphics &amp; Marketing, a software and marketing studio in Keysville, to show what the town’s website could be. The Town of Keysville, its council and its staff did not request it, authorize it, approve it or pay for it, and Pascat is not affiliated with the town.</p>' +
      '<h2>What is real and what is not</h2><ul><li>Town Hall’s address, phone number and office hours, and the links to documents on the current town site, are real and were taken from keysvilleva.gov.</li><li>Anything in [brackets], and any list marked “Sample content,” is a placeholder, not real town information.</li><li>Forms here do not reach Town Hall. What you type stays in your own browser and is erased when you reset the demo.</li><li>The help assistant answers only from the sample answers on this demo.</li></ul>' +
      '<h2>Official town business</h2><p>Use ' + extLink('https://keysvilleva.gov', 'keysvilleva.gov') + ' or call Town Hall at 434-736-9551.</p>' +
      '<h2>About the standards used</h2><p>The demo is built to WCAG 2.2 AA, validates as HTML5 and CSS, carries the privacy, FOIA, accessibility, nondiscrimination and language-access notices Virginia and federal law expect of a town website, and works in English and Spanish on phones, tablets and desktops.</p>' +
      '<h2>Contact Pascat</h2><p>' + pascatLogo('pascat-logo-about') + '</p><p>Pascat Graphics &amp; Marketing, Keysville, Virginia. 434-808-2414. ' + extLink('https://pascatgraphics.com', 'pascatgraphics.com') + '</p>',
      '<p><strong>Este no es el sitio web del pueblo de Keysville.</strong> Es una demostración funcional creada por Pascat Graphics &amp; Marketing, un estudio de software y mercadeo en Keysville, para mostrar lo que podría ser el sitio web del pueblo. El pueblo de Keysville, su Concejo y su personal no la solicitaron, autorizaron, aprobaron ni pagaron, y Pascat no está afiliado al pueblo.</p>' +
      '<h2>Qué es real y qué no</h2><ul><li>La dirección, el teléfono y el horario de la Alcaldía, y los enlaces a documentos del sitio actual del pueblo, son reales y se tomaron de keysvilleva.gov.</li><li>Todo lo que está entre [corchetes] y toda lista marcada como “Contenido de muestra” es un marcador, no información real del pueblo.</li><li>Los formularios de aquí no llegan a la Alcaldía. Lo que escriba se queda en su navegador y se borra al reiniciar la demostración.</li><li>El asistente de ayuda responde solo con las respuestas de muestra de esta demostración.</li></ul>' +
      '<h2>Asuntos oficiales del pueblo</h2><p>Use ' + extLink('https://keysvilleva.gov', 'keysvilleva.gov') + ' o llame a la Alcaldía al 434-736-9551.</p>' +
      '<h2>Sobre los estándares</h2><p>La demostración cumple WCAG 2.2 AA, valida como HTML5 y CSS, incluye los avisos de privacidad, FOIA, accesibilidad, no discriminación y acceso lingüístico que las leyes de Virginia y federales esperan de un sitio municipal, y funciona en inglés y español en teléfonos, tabletas y computadoras.</p>' +
      '<h2>Contacto de Pascat</h2><p>' + pascatLogo('pascat-logo-about') + '</p><p>Pascat Graphics &amp; Marketing, Keysville, Virginia. 434-808-2414. ' + extLink('https://pascatgraphics.com', 'pascatgraphics.com') + '</p>'
    ]
  }
};

views.legal = {
  section: '',
  title: function (arg) { var p = LEGAL[arg] || LEGAL.privacy; return lang() === 'es' ? p.title[1] : p.title[0]; },
  render: function (arg) {
    var key = LEGAL[arg] ? arg : 'privacy';
    var p = LEGAL[key], es = lang() === 'es';
    var nav = '<nav aria-label="' + t('legal_nav') + '" class="legal-nav"><ul class="plain stack">' + LEGAL_ORDER.map(function (k) {
      return '<li>' + link('legal', k, esc(es ? LEGAL[k].title[1] : LEGAL[k].title[0]), '', k === key ? 'aria-current="page"' : '') + '</li>';
    }).join('') + '</ul></nav>';
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('legal_eyebrow'), title: es ? p.title[1] : p.title[0] }) +
      '<div class="wrap split section">' +
      '<div class="main"><div class="prose">' + (es ? p.body[1] : p.body[0]) + '</div>' +
      '<p class="small muted legal-date">' + t('reviewed') + ': 2026-10-24. ' + (es ? 'La versión en inglés es la oficial.' : '') + '</p></div>' +
      '<aside class="side">' + nav + '</aside></div>';
  }
};

addStrings({
  legal_nav: ['Policies and notices', 'Políticas y avisos'],
  legal_eyebrow: ['Policies and notices', 'Políticas y avisos']
});

/* Page not found. The router sends unknown routes here instead of home. */
views.notfound = {
  section: '',
  title: function () { return t('nf_title'); },
  render: function () {
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('nf_eyebrow'), title: t('nf_title'), lead: t('nf_lead') }) +
      '<div class="wrap section"><div class="grid-auto">' +
      link('home', '', '<span class="title">' + t('nav_home') + '</span>', 'card card-link') +
      link('search', '', '<span class="title">' + t('search') + '</span>', 'card card-link') +
      link('help', '', '<span class="title">' + t('nav_help') + '</span>', 'card card-link') +
      link('contact', '', '<span class="title">' + t('nf_contact') + '</span>', 'card card-link') +
      '</div></div>';
  }
};
addStrings({
  nf_eyebrow: ['Error 404', 'Error 404'],
  nf_title: ['We can’t find that page', 'No encontramos esa página'],
  nf_lead: ['The link may be old or mistyped. Try one of these instead, or search the site.', 'El enlace puede ser antiguo o estar mal escrito. Pruebe una de estas opciones o busque en el sitio.'],
  nf_contact: ['Contact Town Hall', 'Contactar a la Alcaldía']
});
