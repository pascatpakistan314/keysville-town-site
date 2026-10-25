/* Seed data. Anything in [brackets] has to come from Town Hall. Lists are samples. */

var SEED_VERSION = 10;

function seed() {
  var now = Date.now();
  var today = todayISO();
  var H = 3600000, D = 86400000;

  function b(en, es) { return { en: en, es: es }; }

  var depts = {
    clerk: { name: b('Town Clerk', 'Secretaría Municipal'), phone: '434-736-9551' },
    billing: { name: b('Water Billing', 'Facturación de Agua'), phone: '434-736-9551' },
    works: { name: b('Public Works', 'Obras Públicas'), phone: '434-736-9551' },
    manager: { name: b('Town Manager', 'Administrador Municipal'), phone: '434-736-9551' },
    council: { name: b('Mayor and Town Council', 'Alcalde y Concejo Municipal'), phone: '434-736-9551' },
    vdot: { name: b('VDOT (state roads)', 'VDOT (carreteras estatales)'), phone: '800-367-7623' },
    power: { name: b('Electric company', 'Compañía eléctrica'), phone: '[Provider outage line]' },
    county: { name: b('Charlotte County', 'Condado de Charlotte'), phone: '434-542-5117' }
  };

  var articles = [
    { id: 'pay-water', topic: 'water', dept: 'billing', reviewed: '2026-10-01', yes: 41, no: 3,
      keys: 'pay water bill sewer online paymentus account number card phone pagar factura agua alcantarillado cuenta tarjeta',
      title: b('How do I pay my water bill?', '¿Cómo pago mi factura de agua?'),
      body: b('You can pay online through Paymentus, the secure payment site the town uses. Have the account number from the top of your bill ready. You can also pay by phone at [Paymentus phone], or bring a check or cash to Town Hall during office hours, 8:30 a.m. to 3:00 p.m., Monday to Friday. There is a drop box by the front door for after hours. Paymentus may add a convenience fee; the town does not keep it.',
        'Puede pagar en línea a través de Paymentus, el sitio de pagos seguro que usa el pueblo. Tenga a la mano el número de cuenta que aparece en la parte superior de su factura. También puede pagar por teléfono al [teléfono de Paymentus], o llevar un cheque o efectivo a la Alcaldía durante el horario de oficina, de 8:30 a.m. a 3:00 p.m., de lunes a viernes. Hay un buzón junto a la puerta principal para después del horario. Paymentus puede cobrar una tarifa de servicio; el pueblo no se la queda.') },
    { id: 'start-water', topic: 'water', dept: 'billing', reviewed: '2026-09-15', yes: 18, no: 1,
      keys: 'start stop water service move new account deposit renter transfer iniciar cancelar servicio agua mudanza depósito inquilino',
      title: b('How do I start, stop or move water service?', '¿Cómo inicio, cancelo o traslado el servicio de agua?'),
      body: b('Fill out the water service form online or at Town Hall. New accounts need a $100 deposit and a $35 connection fee, paid before the water is turned on. Give at least two business days’ notice. Renters need the property owner’s name and phone number.',
        'Llene el formulario de servicio de agua en línea o en la Alcaldía. Las cuentas nuevas requieren un depósito de $100 y una cuota de conexión de $35, pagados antes de conectar el agua. Avise con al menos dos días hábiles de anticipación. Los inquilinos necesitan el nombre y teléfono del propietario.') },
    { id: 'high-bill', topic: 'water', dept: 'billing', reviewed: '2026-08-20', yes: 12, no: 2,
      keys: 'high water bill leak toilet meter running factura alta fuga inodoro medidor',
      title: b('My water bill is much higher than usual. What should I check?', 'Mi factura de agua es mucho más alta de lo normal. ¿Qué debo revisar?'),
      body: b('Most high bills come from a leak. Check toilets first: put a few drops of food coloring in the tank and wait 15 minutes without flushing. Color in the bowl means a leak. Then check outdoor spigots and under sinks. If you find nothing, call Billing at 434-736-9551 and we can check the meter reading with you.',
        'La mayoría de las facturas altas se deben a una fuga. Revise primero los inodoros: ponga unas gotas de colorante en el tanque y espere 15 minutos sin jalar. Si el color aparece en la taza, hay una fuga. Luego revise las llaves exteriores y debajo de los lavabos. Si no encuentra nada, llame a Facturación al 434-736-9551 y revisamos la lectura del medidor con usted.') },
    { id: 'boil-water', topic: 'emergency', dept: 'works', reviewed: '2026-10-10', yes: 30, no: 0,
      keys: 'boil water notice safe drink hervir agua aviso segura beber',
      title: b('What do I do during a boil-water notice?', '¿Qué hago durante un aviso de hervir el agua?'),
      body: b('Bring tap water to a full boil for one minute, let it cool, then use it for drinking, cooking, brushing teeth and making ice. Bottled water is fine too. Showering is safe for most people; don’t swallow the water. We lift the notice as soon as tests come back clean, usually within 24 to 48 hours, and post it here and by text if you’re signed up.',
        'Hierva el agua del grifo durante un minuto, déjela enfriar y úsela para beber, cocinar, cepillarse los dientes y hacer hielo. El agua embotellada también sirve. Bañarse es seguro para la mayoría de las personas; no trague el agua. Levantamos el aviso en cuanto los análisis salen limpios, normalmente en 24 a 48 horas, y lo publicamos aquí y por mensaje de texto si está suscrito.') },
    { id: 'trash-day', topic: 'trash', dept: 'works', reviewed: '2026-10-05', yes: 55, no: 4,
      keys: 'trash pickup day garbage can curb schedule holiday basura recogida día bote acera horario feriado',
      title: b('When is trash picked up?', '¿Cuándo recogen la basura?'),
      body: b('Trash is picked up once a week. Your day depends on your street; use the pickup-day lookup on the Trash and recycling page. Have the can at the curb by [time], lid closed, handles facing the street. When a holiday falls on a weekday, pickup moves one day later that week, and we post the change as an alert.',
        'La basura se recoge una vez por semana. Su día depende de su calle; use la búsqueda de día de recogida en la página de Basura y reciclaje. Tenga el bote en la acera antes de las [hora], con la tapa cerrada y las asas hacia la calle. Cuando un feriado cae entre semana, la recogida se pasa un día esa semana y publicamos el cambio como aviso.') },
    { id: 'bulky', topic: 'trash', dept: 'works', reviewed: '2026-07-30', yes: 9, no: 1,
      keys: 'bulky item furniture mattress appliance couch tv tires paint county dump convenience center muebles colchón electrodoméstico sofá llantas pintura basurero del condado',
      title: b('How do I get rid of furniture, appliances or tires?', '¿Cómo me deshago de muebles, electrodomésticos o llantas?'),
      body: b('Call Public Works at 434-736-9551 to schedule a bulky pickup for furniture and mattresses. [Fee, if any.] Appliances, tires, paint and building debris are not collected at the curb. Charlotte County runs convenience centers for residents; the Keysville Convenience Center is at 65 Arvin Street, open Monday to Saturday 7 a.m. to 6 p.m. and Sunday 1 to 5 p.m.',
        'Llame a Obras Públicas al 434-736-9551 para programar una recogida de artículos voluminosos como muebles y colchones. [Tarifa, si aplica.] Electrodomésticos, llantas, pintura y escombros de construcción no se recogen en la acera. El condado de Charlotte tiene centros de recolección para residentes; el Centro de Recolección de Keysville está en 65 Arvin Street, abierto de lunes a sábado de 7 a.m. a 6 p.m. y domingo de 1 a 5 p.m.') },
    { id: 'pothole', topic: 'streets', dept: 'works', reviewed: '2026-09-01', yes: 14, no: 2,
      keys: 'pothole street road repair vdot state route report bache calle carretera reparar reportar',
      title: b('Who fixes potholes on my street?', '¿Quién arregla los baches en mi calle?'),
      body: b('It depends on the street. In towns the size of Keysville, most streets are state routes maintained by VDOT. Report a problem here and we send it to the right crew: a town street goes to Public Works, a state route goes to VDOT at 800-367-7623 (800-FOR-ROAD). You get a reference number either way. [Town Hall to confirm which streets the town maintains.]',
        'Depende de la calle. En pueblos del tamaño de Keysville, la mayoría de las calles son rutas estatales a cargo de VDOT. Reporte el problema aquí y lo enviamos al equipo correcto: una calle del pueblo va a Obras Públicas y una ruta estatal va a VDOT al 800-367-7623. En cualquier caso recibe un número de referencia.') },
    { id: 'streetlight', topic: 'streets', dept: 'works', reviewed: '2026-09-01', yes: 7, no: 0,
      keys: 'streetlight out light pole dark electric company farol luz poste apagado compañía eléctrica',
      title: b('A streetlight is out. Who do I tell?', 'Un farol está apagado. ¿A quién le aviso?'),
      body: b('Tell us. The lights belong to the electric company, but Public Works files the repair for you so you don’t have to hunt for a pole number. Use Report a problem and pick “Streetlight out.” If you can, tell us the nearest address.',
        'Avísenos. Los faroles pertenecen a la compañía eléctrica, pero Obras Públicas hace el reporte por usted para que no tenga que buscar el número del poste. Use Reportar un problema y elija “Farol apagado”. Si puede, indique la dirección más cercana.') },
    { id: 'biz-license', topic: 'permits', dept: 'clerk', reviewed: '2026-06-12', yes: 11, no: 1,
      keys: 'business license apply renew new business fee licencia de negocio solicitar renovar',
      title: b('How do I get or renew a business license?', '¿Cómo obtengo o renuevo una licencia de negocio?'),
      body: b('Apply or renew online through Documents and forms, or at Town Hall. The fee is $0.04 per $100 of gross receipts, with a $30 minimum. Licenses run on the calendar year and renew by March 1; late renewals carry a 10% penalty. New businesses should also check with Charlotte County about county requirements.',
        'Solicite o renueve en línea en Documentos y formularios, o en la Alcaldía. La tarifa es $0.04 por cada $100 de ingresos brutos, con un mínimo de $30. Las licencias son por año calendario y se renuevan antes del 1 de marzo; las renovaciones tardías tienen un recargo del 10%. Los negocios nuevos también deben consultar con el condado de Charlotte sobre los requisitos del condado.') },
    { id: 'zoning', topic: 'permits', dept: 'clerk', reviewed: '2026-06-12', yes: 6, no: 2,
      keys: 'zoning permit shed fence addition build building permit county permiso zonificación cobertizo cerca construcción',
      title: b('Do I need a permit for a shed, fence or addition?', '¿Necesito un permiso para un cobertizo, una cerca o una ampliación?'),
      body: b('Usually two things: a zoning permit from the town, which checks where you can build, and a building permit from Charlotte County, which checks how. Start with the town zoning permit form. The clerk will tell you if a county permit is needed too.',
        'Normalmente dos cosas: un permiso de zonificación del pueblo, que revisa dónde puede construir, y un permiso de construcción del condado de Charlotte, que revisa cómo. Empiece con el formulario de permiso de zonificación del pueblo. La secretaría le dirá si también necesita el permiso del condado.') },
    { id: 'speak-council', topic: 'government', dept: 'clerk', reviewed: '2026-10-01', yes: 8, no: 0,
      keys: 'speak council meeting public comment agenda hablar reunión concejo comentario público',
      title: b('How do I speak at a council meeting?', '¿Cómo hablo en una reunión del Concejo?'),
      body: b('Come to the meeting and sign in with the clerk before it starts. When public comment is called, give your name and street and speak for up to [number] minutes. You don’t have to be on the agenda. If you need an interpreter, large print or another accommodation, call the clerk two business days ahead and we’ll arrange it at no cost.',
        'Venga a la reunión y regístrese con la secretaria antes de que empiece. Cuando se abra el comentario público, diga su nombre y su calle y hable hasta [número] minutos. No necesita estar en la agenda. Si necesita un intérprete, letra grande u otra adaptación, llame a la secretaría dos días hábiles antes y lo arreglamos sin costo.') },
    { id: 'foia', topic: 'government', dept: 'clerk', reviewed: '2026-10-01', yes: 5, no: 0,
      keys: 'public records request foia freedom of information copy minutes documents solicitud registros públicos copia',
      title: b('How do I request a public record?', '¿Cómo solicito un registro público?'),
      body: b('Under the Virginia Freedom of Information Act, anyone living in Virginia can ask for town records. Use the Public records page or write to the FOIA officer. The town must respond within five working days. Copies may carry a reasonable charge; you can ask for a cost estimate first.',
        'Según la Ley de Libertad de Información de Virginia, cualquier persona que viva en Virginia puede pedir registros del pueblo. Use la página de Registros públicos o escriba al oficial de FOIA. El pueblo debe responder en cinco días hábiles. Las copias pueden tener un costo razonable; puede pedir un estimado primero.') },
    { id: 'town-county', topic: 'government', dept: 'clerk', reviewed: '2026-09-20', yes: 22, no: 1,
      keys: 'town or county taxes sheriff school voter register dmv who handles pueblo condado impuestos sheriff escuela votar',
      title: b('Is that the town or the county?', '¿Eso es del pueblo o del condado?'),
      body: b('The town handles water and sewer, trash pickup, town streets, zoning inside town limits and business licenses. Charlotte County handles real estate and personal property taxes, the sheriff, schools, voter registration, building permits and social services. Not sure? Use the Town or county lookup, or call us and we’ll point you right.',
        'El pueblo se encarga del agua y alcantarillado, la recogida de basura, las calles del pueblo, la zonificación dentro de los límites y las licencias de negocio. El condado de Charlotte se encarga de los impuestos sobre bienes inmuebles y personales, el sheriff, las escuelas, el registro de votantes, los permisos de construcción y los servicios sociales. ¿No está seguro? Use la búsqueda Pueblo o condado, o llámenos.') },
    { id: 'interpreter', topic: 'language', dept: 'clerk', reviewed: '2026-10-15', yes: 4, no: 0,
      keys: 'spanish interpreter language translation help español intérprete idioma traducción ayuda',
      title: b('Can I get help in Spanish or another language?', '¿Puedo recibir ayuda en español u otro idioma?'),
      body: b('Yes, free of charge. This website is in English and Spanish. For phone calls or visits in any language, Town Hall uses a telephone interpreter service; just ask. For meetings, call two business days ahead so we can arrange an interpreter.',
        'Sí, sin costo. Este sitio web está en inglés y español. Para llamadas o visitas en cualquier idioma, la Alcaldía usa un servicio de intérpretes por teléfono; solo pídalo. Para reuniones, llame dos días hábiles antes para que podamos conseguir un intérprete.') },
    { id: 'a11y-help', topic: 'accessibility', dept: 'clerk', reviewed: '2026-10-15', yes: 6, no: 0,
      keys: 'accessibility screen reader large print hearing relay 711 accommodation disability accesibilidad lector de pantalla letra grande audición',
      title: b('I have trouble seeing or hearing. How can the town help?', 'Tengo dificultad para ver u oír. ¿Cómo puede ayudarme el pueblo?'),
      body: b('Use the Accessibility button at the bottom of any page to make text bigger, raise contrast, switch to an easier font, simplify the page or have it read aloud. For phone calls, dial 711 for Virginia Relay. For meetings and documents, we provide large print, audio, sign language interpreters and assistive listening on request. Ask the ADA coordinator at [phone].',
        'Use el botón de Accesibilidad al pie de cualquier página para agrandar el texto, aumentar el contraste, cambiar a una fuente más fácil de leer, simplificar la página o escucharla en voz alta. Para llamadas, marque 711 (Virginia Relay). Para reuniones y documentos ofrecemos letra grande, audio, intérpretes de lengua de señas y equipos de audición asistida. Pregunte al coordinador de la ADA al 434-736-9551.') }
  ];

  var biz = [
    { id: 'main-street-diner', name: '[Diner name]', cat: 'food', since: '[year]', owner: '[Owner]', spotlight: true, isNew: false,
      tagline: b('Breakfast all day and a lunch counter that fills up by noon.', 'Desayuno todo el día y una barra de almuerzo que se llena al mediodía.'),
      story: b('A Keysville fixture. Regulars come for the biscuits and gravy and stay for the news. The daily special is on the board by the register.', 'Un clásico de Keysville. Los clientes de siempre vienen por los biscuits con gravy y se quedan a conversar. El especial del día está en la pizarra junto a la caja.'),
      street: '[Street address]', mail: '', phone: '[Phone]', website: '',
      hours: { mon: ['06:00', '14:00'], tue: ['06:00', '14:00'], wed: ['06:00', '14:00'], thu: ['06:00', '14:00'], fri: ['06:00', '20:00'], sat: ['06:00', '14:00'], sun: null },
      offers: [b('Daily lunch special', 'Especial de almuerzo diario'), b('Carry-out', 'Para llevar')], photos: ['The counter at opening time, stools in a row, coffee pots on, morning light through the front window.', 'A plate of the Saturday breakfast special on the counter, shot from above.'], tags: ['breakfast', 'lunch', 'diner', 'coffee'] },
    { id: 'keysville-pizza', name: '[Pizza shop name]', cat: 'food', since: '[year]', owner: '[Owner]', spotlight: false, isNew: true,
      tagline: b('Hand-tossed pies, subs and wings, open late on game nights.', 'Pizzas artesanales, sándwiches y alitas, abierto hasta tarde los días de partido.'),
      story: b('New this year. Family-run, with a few tables inside and a steady line of pickups out the door on Fridays.', 'Nuevo este año. Un negocio familiar con unas mesas adentro y una fila constante de pedidos para llevar los viernes.'),
      street: '[Street address]', mail: '', phone: '[Phone]', website: '[website]',
      hours: { mon: null, tue: ['11:00', '21:00'], wed: ['11:00', '21:00'], thu: ['11:00', '21:00'], fri: ['11:00', '22:00'], sat: ['11:00', '22:00'], sun: ['12:00', '20:00'] },
      offers: [b('Large one-topping, [price] on Tuesdays', 'Pizza grande de un ingrediente, [precio] los martes')], photos: ['The oven and prep line with a pizza going in, taken from the counter.'], tags: ['pizza', 'subs', 'wings', 'delivery'] },
    { id: 'county-line-auto', name: '[Auto shop name]', cat: 'auto', since: '[year]', owner: '[Owner]', spotlight: false, isNew: false,
      tagline: b('Repairs, state inspections and tires, with a ride home if you need one.', 'Reparaciones, inspecciones estatales y llantas, con transporte a casa si lo necesita.'),
      story: b('Three bays and a waiting room with real coffee. They’ll show you the worn part before they replace it.', 'Tres bahías y una sala de espera con café de verdad. Le muestran la pieza gastada antes de cambiarla.'),
      street: '[Street address]', mail: 'P.O. Box [number], Keysville, VA 23947', phone: '[Phone]', website: '',
      hours: { mon: ['08:00', '17:00'], tue: ['08:00', '17:00'], wed: ['08:00', '17:00'], thu: ['08:00', '17:00'], fri: ['08:00', '17:00'], sat: null, sun: null },
      offers: [b('Virginia state inspection', 'Inspección estatal de Virginia')], photos: ['Front of the shop with the bay doors open and a truck on the lift inside.'], tags: ['auto', 'repair', 'tires', 'inspection'] },
    { id: 'hardware-feed', name: '[Hardware store name]', cat: 'shop', since: '[year]', owner: '[Owner]', spotlight: true, isNew: false,
      tagline: b('Hardware, feed, seed and the part you couldn’t find anywhere else.', 'Ferretería, alimento para animales, semillas y la pieza que no encontró en ningún otro lado.'),
      story: b('Wood floors, a key machine that still works and staff who know what you’re describing. Garden supplies out back in spring.', 'Pisos de madera, una máquina de llaves que todavía funciona y empleados que entienden lo que usted describe. Artículos de jardín en la parte de atrás en primavera.'),
      street: '[Street address]', mail: '', phone: '[Phone]', website: '',
      hours: { mon: ['07:30', '17:30'], tue: ['07:30', '17:30'], wed: ['07:30', '17:30'], thu: ['07:30', '17:30'], fri: ['07:30', '17:30'], sat: ['08:00', '13:00'], sun: null },
      offers: [b('Key cutting while you wait', 'Copias de llaves al momento'), b('Propane refills', 'Recarga de propano')], photos: ['The main aisle looking toward the register, bins of fasteners along the wall.'], tags: ['hardware', 'feed', 'garden', 'propane'] },
    { id: 'main-street-salon', name: '[Salon name]', cat: 'services', since: '[year]', owner: '[Owner]', spotlight: false, isNew: false,
      tagline: b('Cuts, color and walk-ins when a chair is open.', 'Cortes, color y sin cita cuando hay una silla libre.'),
      story: b('Two chairs, one owner who has been cutting hair in town for [number] years, and a wall of school photos going back decades.', 'Dos sillas, una dueña que lleva [número] años cortando pelo en el pueblo y una pared de fotos escolares de varias décadas.'),
      street: '[Street address]', mail: '', phone: '[Phone]', website: '',
      hours: { mon: null, tue: ['09:00', '18:00'], wed: ['09:00', '18:00'], thu: ['09:00', '19:00'], fri: ['09:00', '18:00'], sat: ['08:00', '14:00'], sun: null },
      offers: [], photos: ['The front window from the sidewalk with the shop name on the glass.'], tags: ['hair', 'salon', 'barber'] },
    { id: 'town-pharmacy', name: '[Pharmacy name]', cat: 'health', since: '[year]', owner: '[Owner]', spotlight: false, isNew: false,
      tagline: b('Prescriptions, vaccines and a pharmacist who knows your name.', 'Recetas, vacunas y un farmacéutico que lo conoce por su nombre.'),
      story: b('Independent pharmacy with free local delivery for anyone who can’t get out. Flu shots every fall, no appointment.', 'Farmacia independiente con entrega local gratis para quien no pueda salir. Vacunas contra la gripe cada otoño, sin cita.'),
      street: '[Street address]', mail: '', phone: '[Phone]', website: '',
      hours: { mon: ['09:00', '18:00'], tue: ['09:00', '18:00'], wed: ['09:00', '18:00'], thu: ['09:00', '18:00'], fri: ['09:00', '18:00'], sat: ['09:00', '13:00'], sun: null },
      offers: [b('Free delivery in town', 'Entrega gratis dentro del pueblo')], photos: ['The pharmacy counter with the pharmacist in a white coat, face turned away or with permission.'], tags: ['pharmacy', 'health', 'vaccines', 'delivery'] },
    { id: 'keysville-florist', name: '[Florist name]', cat: 'shop', since: '[year]', owner: '[Owner]', spotlight: false, isNew: false,
      tagline: b('Fresh arrangements, funeral and wedding flowers, same-day in town.', 'Arreglos frescos, flores para funerales y bodas, entrega el mismo día en el pueblo.'),
      story: b('Call before 1 p.m. for same-day. They also stock local honey and a few gifts.', 'Llame antes de la 1 p.m. para entrega el mismo día. También venden miel local y algunos regalos.'),
      street: '[Street address]', mail: '', phone: '[Phone]', website: '',
      hours: { mon: ['09:00', '17:00'], tue: ['09:00', '17:00'], wed: ['09:00', '17:00'], thu: ['09:00', '17:00'], fri: ['09:00', '17:00'], sat: ['09:00', '12:00'], sun: null },
      offers: [], photos: ['Buckets of cut flowers in the cooler, door open, shot straight on.'], tags: ['flowers', 'gifts', 'wedding'] },
    { id: 'southside-cafe', name: '[Coffee shop name]', cat: 'food', since: '[year]', owner: '[Owner]', spotlight: false, isNew: true,
      tagline: b('Espresso, pastries and a quiet table with Wi-Fi.', 'Espresso, pasteles y una mesa tranquila con Wi-Fi.'),
      story: b('Opened this spring in the old bank building. Local art on the walls, open mic the first Friday of the month.', 'Abrió esta primavera en el antiguo edificio del banco. Arte local en las paredes y micrófono abierto el primer viernes de cada mes.'),
      street: '[Street address]', mail: '', phone: '[Phone]', website: '[website]',
      hours: { mon: ['07:00', '15:00'], tue: ['07:00', '15:00'], wed: ['07:00', '15:00'], thu: ['07:00', '15:00'], fri: ['07:00', '20:00'], sat: ['08:00', '15:00'], sun: null },
      offers: [b('First Friday open mic', 'Micrófono abierto el primer viernes')], photos: ['The espresso bar with the old bank vault door visible behind it.'], tags: ['coffee', 'cafe', 'wifi', 'pastries'] }
  ];

  var meetings = [
    { id: 'm-2026-11-09', body: 'council', kind: 'regular', date: '2026-11-09', time: '19:00', place: 'Council chambers, Town Hall', status: 'scheduled', agenda: true, postedOn: '2026-11-03', minutes: 'none', minutesApproved: null, minutesPosted: null, video: false,
      items: ['Call to order and Pledge of Allegiance', 'Approve minutes of the October 12 meeting', 'Public comment', 'Public hearing: [ordinance or zoning item]', 'Unfinished business', 'New business', 'Reports: Town Manager, Public Works, Treasurer', 'Adjourn'] },
    { id: 'm-2026-11-17', body: 'planning', kind: 'regular', date: '2026-11-17', time: '18:30', place: 'Council chambers, Town Hall', status: 'scheduled', agenda: false, postedOn: null, minutes: 'none', minutesApproved: null, minutesPosted: null, video: false, items: [] },
    { id: 'm-2026-10-12', body: 'council', kind: 'regular', date: '2026-10-12', time: '19:00', place: 'Council chambers, Town Hall', status: 'scheduled', agenda: true, postedOn: '2026-10-06', minutes: 'draft', minutesApproved: null, minutesPosted: null, video: true,
      items: ['Call to order', 'Approve minutes of September 14', 'Public comment', 'Water tank inspection update', 'Leaf pickup schedule', 'Reports', 'Adjourn'] },
    { id: 'm-2026-09-15', body: 'planning', kind: 'regular', date: '2026-09-15', time: '18:30', place: 'Council chambers, Town Hall', status: 'scheduled', agenda: true, postedOn: '2026-09-08', minutes: 'approved', minutesApproved: '2026-10-20', minutesPosted: '2026-10-21', video: false, items: ['Call to order', 'Site plan review: [address]', 'Adjourn'] },
    { id: 'm-2026-09-14', body: 'council', kind: 'regular', date: '2026-09-14', time: '19:00', place: 'Council chambers, Town Hall', status: 'scheduled', agenda: true, postedOn: '2026-09-01', minutes: 'approved', minutesApproved: '2026-10-13', minutesPosted: '2026-10-14', video: true, items: ['Call to order', 'Approve minutes of August 10', 'Public comment', 'FY2027 budget amendment', 'Reports', 'Adjourn'] },
    { id: 'm-2026-08-10', body: 'council', kind: 'regular', date: '2026-08-10', time: '19:00', place: 'Council chambers, Town Hall', status: 'scheduled', agenda: true, postedOn: '2026-08-04', minutes: 'approved', minutesApproved: '2026-09-08', minutesPosted: '2026-09-25', video: true, items: ['Call to order', 'Approve minutes of July 13', 'Public comment', 'Christmas parade route', 'Reports', 'Adjourn'] },
    { id: 'm-2026-07-13', body: 'council', kind: 'regular', date: '2026-07-13', time: '19:00', place: 'Council chambers, Town Hall', status: 'scheduled', agenda: true, postedOn: '2026-07-07', minutes: 'approved', minutesApproved: '2026-08-11', minutesPosted: '2026-08-12', video: true, items: [] },
    { id: 'm-2026-06-08', body: 'council', kind: 'regular', date: '2026-06-08', time: '19:00', place: 'Council chambers, Town Hall', status: 'scheduled', agenda: true, postedOn: '2026-06-02', minutes: 'approved', minutesApproved: '2026-07-14', minutesPosted: '2026-07-15', video: true, items: [] },
    { id: 'm-2026-05-19', body: 'bza', kind: 'hearing', date: '2026-05-19', time: '18:00', place: 'Council chambers, Town Hall', status: 'scheduled', agenda: true, postedOn: '2026-05-12', minutes: 'approved', minutesApproved: '2026-06-16', minutesPosted: '2026-06-17', video: false, items: ['Variance request: [address]'] }
  ];

  var events = [
    { id: 'e-election', date: '2026-11-03', time: '06:00', end: '19:00', kind: 'election', home: true, title: b('Election Day', 'Día de elecciones'), place: b('Your polling place', 'Su lugar de votación'), note: b('Polls are open 6 a.m. to 7 p.m. Check your polling place with the Charlotte County registrar.', 'Las urnas abren de 6 a.m. a 7 p.m. Confirme su lugar de votación con el registrador del condado de Charlotte.') },
    { id: 'e-leaf', date: '2026-11-09', time: '07:00', end: '', kind: 'works', home: false, title: b('Leaf pickup begins (north side)', 'Comienza la recogida de hojas (lado norte)'), place: b('North side streets', 'Calles del lado norte'), note: b('Bag leaves and set them at the curb by 7 a.m.', 'Embolse las hojas y póngalas en la acera antes de las 7 a.m.') },
    { id: 'e-cleanup', date: '2026-11-21', time: '09:00', end: '12:00', kind: 'community', home: true, title: b('Fall town cleanup day', 'Día de limpieza de otoño'), place: b('Meet at Town Hall', 'Punto de encuentro: la Alcaldía'), note: b('Gloves and bags provided. Coffee and doughnuts at 8:30.', 'Se proveen guantes y bolsas. Café y donas a las 8:30.') },
    { id: 'e-thanks1', date: '2026-11-26', time: '', end: '', kind: 'closing', home: true, title: b('Town Hall closed for Thanksgiving', 'Alcaldía cerrada por el Día de Acción de Gracias'), place: b('', ''), note: b('Trash pickup moves one day later this week.', 'La recogida de basura se pasa un día esta semana.') },
    { id: 'e-thanks2', date: '2026-11-27', time: '', end: '', kind: 'closing', home: false, title: b('Town Hall closed', 'Alcaldía cerrada'), place: b('', ''), note: b('Offices reopen Monday, November 30.', 'Las oficinas reabren el lunes 30 de noviembre.') },
    { id: 'e-parade', date: '2026-12-05', time: '14:00', end: '16:00', kind: 'community', home: true, title: b('Christmas parade', 'Desfile de Navidad'), place: b('Main Street', 'Main Street'), note: b('Floats, bands and Santa. Entries are open through November 20.', 'Carrozas, bandas y Santa. Inscripciones abiertas hasta el 20 de noviembre.') },
    { id: 'e-xmas', date: '2026-12-25', time: '', end: '', kind: 'closing', home: false, title: b('Town Hall closed for Christmas', 'Alcaldía cerrada por Navidad'), place: b('', ''), note: b('', '') },
    { id: 'e-newyear', date: '2027-01-01', time: '', end: '', kind: 'closing', home: false, title: b('Town Hall closed for New Year’s Day', 'Alcaldía cerrada por Año Nuevo'), place: b('', ''), note: b('', '') }
  ];

  var tickets = [
    { ref: 'K-1048', cat: 'pothole', dept: 'works', status: 'new', created: now - 2 * H, name: '[Resident name]', contact: '[email]', where: '[Street], near the post office', text: 'Deep hole in the right lane. A car hit it this morning and blew a tire.', lang: 'en', source: 'report', due: null,
      timeline: [{ t: now - 2 * H, who: 'resident', text: 'Deep hole in the right lane. A car hit it this morning and blew a tire.', public: true }, { t: now - 2 * H + 1, who: 'system', dept: 'works', text: '', public: true }] },
    { ref: 'K-1047', cat: 'billing', dept: 'billing', status: 'progress', created: now - 4 * H, name: '[Resident name]', contact: '[phone]', where: '', text: 'Mi factura se duplicó este mes. ¿Pueden revisar la lectura del medidor?', lang: 'es', source: 'contact', due: null,
      timeline: [{ t: now - 4 * H, who: 'resident', text: 'Mi factura se duplicó este mes. ¿Pueden revisar la lectura del medidor?', public: true }, { t: now - 4 * H + 1, who: 'system', dept: 'billing', text: '', public: true }, { t: now - 1 * H, who: 'staff', text: 'We’ll re-read your meter on Monday and call you with what we find. / Volveremos a leer su medidor el lunes y le llamaremos con el resultado.', public: true }] },
    { ref: 'K-1046', cat: 'records', dept: 'clerk', status: 'new', created: now - 1 * D, name: '[Resident name]', contact: '[email]', where: '', text: 'Requesting the Board of Zoning Appeals decision for [address].', lang: 'en', source: 'records', due: now + 4 * D,
      timeline: [{ t: now - 1 * D, who: 'resident', text: 'Requesting the Board of Zoning Appeals decision for [address].', public: true }, { t: now - 1 * D + 1, who: 'system', dept: 'clerk', text: '', public: true }] },
    { ref: 'K-1045', cat: 'other', dept: 'clerk', status: 'waiting', created: now - 1 * D - 3 * H, name: '[Organization name]', contact: '[phone]', where: 'Main Street', text: 'We would like to enter one float and a pickup truck in the Christmas parade.', lang: 'en', source: 'contact', due: null,
      timeline: [{ t: now - 1 * D - 3 * H, who: 'resident', text: 'We would like to enter one float and a pickup truck in the Christmas parade.', public: true }, { t: now - 20 * H, who: 'staff', text: 'Great. Can you send the length of the float and a contact phone for the day of?', public: true }] },
    { ref: 'K-1041', cat: 'light', dept: 'works', status: 'resolved', created: now - 3 * D, name: '[Resident name]', contact: '', where: '[Street] at [cross street]', text: 'Light has been out for a week.', lang: 'en', source: 'report', due: null,
      timeline: [{ t: now - 3 * D, who: 'resident', text: 'Light has been out for a week.', public: true }, { t: now - 3 * D + 1, who: 'system', dept: 'works', text: '', public: true }, { t: now - 2 * D, who: 'staff', text: 'Filed with the electric company, pole 4417.', public: true }, { t: now - 6 * H, who: 'staff', text: 'Fixed. Thanks for telling us.', public: true }] }
  ];

  return {
    v: SEED_VERSION,
    prefs: { lang: 'en', size: 0, contrast: false, easy: false, simple: false, calm: false },
    alerts: [
      { id: 'a1', level: 'advisory', head: b('Water off on [street name] until 1 p.m. today', 'Sin agua en [calle] hasta la 1 p.m. de hoy'), body: b('Crews are replacing a valve between [cross street] and [cross street]. When water comes back, run the cold tap a few minutes until it runs clear.', 'Las cuadrillas están cambiando una válvula entre [calle] y [calle]. Cuando vuelva el agua, deje correr la llave fría unos minutos hasta que salga clara.'), start: now - 3 * H, end: now + 5 * H, down: false, channels: ['text', 'email'] },
      { id: 'a0', level: 'notice', head: b('Boil-water notice lifted for [area]', 'Se levanta el aviso de hervir el agua en [zona]'), body: b('Tests came back clean. Water is safe to drink.', 'Los análisis salieron limpios. El agua es segura para beber.'), start: now - 22 * D, end: now - 20 * D, down: true, channels: ['text', 'email'] },
      { id: 'a-1', level: 'emergency', head: b('Boil-water notice for [area]', 'Aviso de hervir el agua en [zona]'), body: b('A main break lowered pressure. Boil water for one minute before drinking or cooking until further notice.', 'Una rotura de tubería bajó la presión. Hierva el agua un minuto antes de beber o cocinar hasta nuevo aviso.'), start: now - 24 * D, end: now - 22 * D, down: true, channels: ['text', 'email'] }
    ],
    news: [
      { id: 'n1', date: '2026-10-22', title: b('Fall leaf pickup schedule is posted', 'Ya está publicado el calendario de recogida de hojas'), body: b('Public Works will run the leaf truck street by street from November 9 through mid-December. Bag leaves in paper or plastic bags and set them at the curb by 7 a.m. the Monday of your street’s week. Loose piles can’t be collected.', 'Obras Públicas pasará el camión de hojas calle por calle del 9 de noviembre a mediados de diciembre. Embolse las hojas en bolsas de papel o plástico y póngalas en la acera antes de las 7 a.m. del lunes de la semana de su calle. No se recogen montones sueltos.'), photo: 'Leaf bags lined up at a Keysville curb on a fall morning, a house and trees behind them.' },
      { id: 'n2', date: '2026-10-15', title: b('Hydrant flushing on the west side next week', 'Limpieza de hidrantes en el lado oeste la próxima semana'), body: b('Crews will flush hydrants October 26 through 30. Water may look cloudy for a few hours. It is safe; run the cold tap until it clears before doing laundry.', 'Las cuadrillas limpiarán los hidrantes del 26 al 30 de octubre. El agua puede verse turbia unas horas. Es segura; deje correr la llave fría hasta que salga clara antes de lavar ropa.'), photo: '' },
      { id: 'n3', date: '2026-10-08', title: b('Christmas parade entries are open', 'Inscripciones abiertas para el desfile de Navidad'), body: b('Floats, bands, churches and businesses can sign up online through November 20. The parade steps off at 2 p.m. on Saturday, December 5.', 'Carrozas, bandas, iglesias y negocios pueden inscribirse en línea hasta el 20 de noviembre. El desfile comienza a las 2 p.m. el sábado 5 de diciembre.'), photo: 'Last year’s parade on Main Street, a float passing the crowd, taken from the sidewalk.' },
      { id: 'n4', date: '2026-09-30', title: b('A new town website', 'Un nuevo sitio web del pueblo'), body: b('Pay bills, find minutes and report problems from your phone, in English or Spanish. Tell us what’s missing with the feedback link at the bottom of every page.', 'Pague facturas, encuentre actas y reporte problemas desde su teléfono, en inglés o español. Díganos qué falta con el enlace de comentarios al pie de cada página.'), photo: '' }
    ],
    events: events,
    meetings: meetings,
    docs: [
      { id: 'd1', title: 'Town Council minutes, September 8, 2026', type: 'minutes', date: '2026-10-14', scanned: false, online: false, size: 'PDF, 180 KB', retention: 'Permanent' },
      { id: 'd2', title: 'Adopted budget, fiscal year 2027', type: 'budget', date: '2026-06-09', scanned: false, online: false, size: 'PDF, 1.2 MB', retention: 'Permanent' },
      { id: 'd3', title: 'Zoning ordinance (full text)', type: 'ordinance', date: '2025-03-11', scanned: false, online: false, size: 'Web page and PDF, 2.4 MB', retention: 'Permanent' },
      { id: 'd4', title: 'Water and sewer rate ordinance', type: 'ordinance', date: '2026-07-01', scanned: false, online: false, size: 'Web page and PDF, 90 KB', retention: 'Permanent' },
      { id: 'd5', title: 'Business license application', type: 'form', date: '2026-01-05', scanned: false, online: true, size: 'Online form or PDF, 60 KB', retention: '3 years after expiration' },
      { id: 'd6', title: 'Zoning permit application', type: 'form', date: '2026-01-05', scanned: false, online: true, size: 'Online form or PDF, 70 KB', retention: 'Permanent' },
      { id: 'd7', title: 'Water service start or stop', type: 'form', date: '2026-01-05', scanned: false, online: true, size: 'Online form or PDF, 45 KB', retention: '3 years after account closes' },
      { id: 'd8', title: 'Annual drinking water quality report, 2025', type: 'report', date: '2026-06-30', scanned: false, online: false, size: 'PDF, 640 KB', retention: '12 years' },
      { id: 'd9', title: 'Comprehensive plan', type: 'report', date: '2022-04-12', scanned: false, online: false, size: 'PDF, 8.1 MB', retention: 'Permanent' },
      { id: 'd10', title: 'Zoning map', type: 'report', date: '2019-05-14', scanned: true, online: false, size: 'PDF, 3.3 MB (scanned)', retention: 'Permanent' },
      { id: 'd11', title: 'Town Council minutes, March 9, 2021', type: 'minutes', date: '2021-04-14', scanned: true, online: false, size: 'PDF, 2.0 MB (scanned)', retention: 'Permanent' },
      { id: 'd12', title: 'Public records (FOIA) request form', type: 'form', date: '2026-10-01', scanned: false, online: true, size: 'Online form or PDF, 40 KB', retention: '3 years' }
    ],
    biz: (typeof BIZ_REAL !== 'undefined' && BIZ_REAL.length) ? BIZ_REAL : biz,
    articles: articles,
    tickets: tickets,
    routes: { pothole: 'works', light: 'works', leak: 'works', trash: 'works', billing: 'billing', records: 'clerk', business: 'clerk', accessible: 'clerk', callback: 'clerk', other: 'clerk' },
    depts: depts,
    notices: [
      { id: 'pn1', kind: 'notice', title: b('Public hearing: [ordinance or zoning item]', 'Audiencia pública: [ordenanza o asunto de zonificación]'), body: b('The Town Council will hold a public hearing on Monday, November 9, 2026 at 7:00 p.m. in the council chambers at Town Hall. Anyone may speak. Copies of the proposal are available at Town Hall and on the Documents page.', 'El Concejo Municipal celebrará una audiencia pública el lunes 9 de noviembre de 2026 a las 7:00 p.m. en la sala del Concejo en la Alcaldía. Cualquier persona puede hablar. Hay copias de la propuesta en la Alcaldía y en la página de Documentos.'), posted: '2026-10-20', closes: '2026-11-10' },
      { id: 'pn2', kind: 'bid', title: b('Invitation to bid: [project name]', 'Convocatoria de licitación: [nombre del proyecto]'), body: b('Sealed bids will be received at Town Hall until [time] on [date]. Specifications are available from the Town Clerk.', 'Se recibirán ofertas selladas en la Alcaldía hasta las [hora] del [fecha]. Las especificaciones están disponibles en la Secretaría Municipal.'), posted: '2026-10-15', closes: '2026-11-13' },
      { id: 'pn3', kind: 'job', title: b('Job opening: Public Works maintenance worker', 'Vacante: trabajador de mantenimiento de Obras Públicas'), body: b('Full time. Valid driver’s license required; CDL a plus. Application at Town Hall or on the Documents page. Open until filled.', 'Tiempo completo. Se requiere licencia de conducir vigente; CDL es una ventaja. Solicitud en la Alcaldía o en la página de Documentos. Abierta hasta cubrirse.'), posted: '2026-10-01', closes: '' }
    ],
    council: [
      { id: 'c1', role: b('Mayor', 'Alcalde'), name: '[Name]', term: '[year]' },
      { id: 'c2', role: b('Vice Mayor', 'Vicealcalde'), name: '[Name]', term: '[year]' },
      { id: 'c3', role: b('Council member', 'Concejal'), name: '[Name]', term: '[year]' },
      { id: 'c4', role: b('Council member', 'Concejal'), name: '[Name]', term: '[year]' },
      { id: 'c5', role: b('Council member', 'Concejal'), name: '[Name]', term: '[year]' },
      { id: 'c6', role: b('Council member', 'Concejal'), name: '[Name]', term: '[year]' },
      { id: 'c7', role: b('Council member', 'Concejal'), name: '[Name]', term: '[year]' }
    ],
    boards: [
      { id: 'planning', name: b('Planning Commission', 'Comisión de Planificación'), about: b('Reviews zoning changes and land use before they go to council.', 'Revisa cambios de zonificación y uso del suelo antes de que pasen al Concejo.'), meets: b('Third Tuesday of the month, 6:30 p.m.', 'Tercer martes del mes, 6:30 p.m.'), vacancies: 1 },
      { id: 'bza', name: b('Board of Zoning Appeals', 'Junta de Apelaciones de Zonificación'), about: b('Hears requests for exceptions to the zoning ordinance.', 'Atiende solicitudes de excepciones a la ordenanza de zonificación.'), meets: b('When a case is filed', 'Cuando se presenta un caso'), vacancies: 0 }
    ],
    status: {
      water: { state: 'issue', text: b('Water off on [street name] until 1 p.m. for a valve repair. Everywhere else is normal.', 'Sin agua en [calle] hasta la 1 p.m. por reparación de válvula. El resto está normal.'), updated: now - 3 * H },
      trash: { state: 'normal', text: b('Pickup is on schedule this week.', 'La recogida va según el horario esta semana.'), updated: now - 30 * H },
      roads: { state: 'normal', text: b('No closures reported. For state routes, check VDOT 511.', 'No hay cierres reportados. Para rutas estatales, consulte VDOT 511.'), updated: now - 30 * H },
      hall: { state: 'normal', text: b('Town Hall is open 8:30 a.m. to 3:00 p.m., Monday to Friday. Closed November 26 and 27 for Thanksgiving.', 'La Alcaldía está abierta de 8:30 a.m. a 3:00 p.m., de lunes a viernes. Cerrada el 26 y 27 de noviembre por Acción de Gracias.'), updated: now - 2 * D },
      emergency: { state: 'normal', text: b('No emergency in effect. In an emergency, call 911.', 'No hay emergencia en curso. En una emergencia, llame al 911.'), updated: now - 2 * D }
    },
    holidays: ['2026-11-11', '2026-11-26', '2026-11-27', '2026-12-25', '2027-01-01', '2027-01-18'],
    leadLines: [
      { street: 'Main Street', status: 'none' }, { street: 'King Street', status: 'unknown' }, { street: 'Church Street', status: 'replaced' },
      { street: 'Charlotte Street', status: 'none' }, { street: 'Depot Street', status: 'unknown' }, { street: 'Patrick Henry Highway', status: 'none' }
    ],
    subscribers: { text: 312, email: 198 },
    pending: { events: [], photos: [] },
    log: [
      { t: now - 1 * H, who: '[Clerk name]', text: 'Replied to K-1047 (billing)' },
      { t: now - 3 * H, who: '[Clerk name]', text: 'Posted advisory: Water off on [street name] until 1 p.m. today' },
      { t: now - 6 * H, who: '[Public Works lead]', text: 'Marked K-1041 resolved and notified the resident' },
      { t: now - 1 * D, who: 'Town Desk', text: 'Nightly check: 2 scanned PDFs, 1 meeting without agenda, 1 business with no street address' },
      { t: now - 2 * D, who: '[Clerk name]', text: 'Published meeting: Town Council regular meeting, Nov 10' }
    ],
    nextRef: 1049
  };
}

S = load() || seed();
if (!load()) save();
