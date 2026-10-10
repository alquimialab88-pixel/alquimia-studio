/* Traduce politica-privacidad.html y delete-account.html de ES (fuente) a EN,
   añadiendo las entradas ES a lang.js (dict/titles/descriptions/placeholders)
   y canonical + html lang="en". Idempotente: si un archivo ya está en EN se omite. */
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Isabel/Documents/Default Project/alquimialab-web';

function decode(s) {
  return s.replace(/&copy;/g, '\u00a9').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&middot;/g, '\u00b7').replace(/&nbsp;/g, ' ');
}

/* ====== PARES [ES, EN] de texto (nodos exactos, sin decodificar) ====== */
const PAIRS = [
  // ---------- politica-privacidad.html ----------
  ['Pol\u00edtica de Privacidad \u00b7 Alquimia Lab', 'Privacy Policy \u00b7 Alquimia Lab'],
  ['Inicio', 'Home'],
  ['Portafolio', 'Portfolio'],
  ['Proyectos', 'Projects'],
  ['Redes Sociales', 'Social Media'],
  ['Personajes IA', 'AI Characters'],
  ['Productos', 'Products'],
  ['Contacto', 'Contact'],
  ['Privacidad', 'Privacy'],
  ['Pol\u00edtica de Privacidad', 'Privacy Policy'],
  ['\u00daltima actualizaci\u00f3n: 21 de Septiembre de 2026', 'Last updated: September 21, 2026'],
  ['1. Informaci\u00f3n General', '1. General Information'],
  ['Esta Pol\u00edtica de Privacidad rige la recopilaci\u00f3n, el uso y la protecci\u00f3n de tu informaci\u00f3n personal cuando visitas y utilizas los servicios de', 'This Privacy Policy governs the collection, use and protection of your personal information when you visit and use the services of'],
  ['(en adelante "nosotros", "nuestro" o "Alquimia Lab"), incluyendo nuestro sitio web', '(hereinafter "us", "our" or "Alquimia Lab"), including our website'],
  [', la aplicaci\u00f3n m\u00f3vil', ', the mobile application'],
  ['(en adelante "la App" o "Kore App") y todos los productos, servicios y contenidos asociados.', '(hereinafter the "App" or "Kore App") and all associated products, services and content.'],
  ['Al acceder o utilizar nuestros servicios, aceptas las pr\u00e1cticas descritas en esta pol\u00edtica. Si tienes menos de 16 a\u00f1os, debes obtener el consentimiento de un padre o tutor legal antes de proporcionar cualquier informaci\u00f3n personal.', 'By accessing or using our services, you accept the practices described in this policy. If you are under 16 years old, you must obtain the consent of a parent or legal guardian before providing any personal information.'],
  ['El responsable del tratamiento de tus datos es', 'The controller of your data is'],
  [', con domicilio en Colombia. Para cualquier consulta sobre esta pol\u00edtica, puedes contactarnos en', ', based in Colombia. For any questions about this policy, you can contact us at'],
  ['2. Tipos de Datos que Recopilamos', '2. Types of Data We Collect'],
  ['Recopilamos y procesamos las siguientes categor\u00edas de informaci\u00f3n cuando interact\u00faas con nuestro sitio web, la', 'We collect and process the following categories of information when you interact with our website, the'],
  ['o nuestros servicios:', 'or our services:'],
  ['2.1 Datos de Contacto', '2.1 Contact Data'],
  ['Informaci\u00f3n proporcionada a trav\u00e9s del formulario de contacto: nombre, correo electr\u00f3nico, asunto y mensaje', 'Information provided through the contact form: name, email address, subject and message'],
  ['Informaci\u00f3n de la correspondencia cuando te ponemos en contacto contigo por correo electr\u00f3nico', 'Correspondence information when we contact you by email'],
  ['2.2 Datos de Suscripci\u00f3n por Email', '2.2 Email Subscription Data'],
  ['Direcci\u00f3n de correo electr\u00f3nico para recibir nuestro bolet\u00edn y secuencias de bienvenida', 'Email address to receive our newsletter and welcome sequences'],
  ['Preferencias de suscripci\u00f3n y estado de la lista de distribuci\u00f3n', 'Subscription preferences and mailing list status'],
  ['Interacciones con emails (aperturas, clics, respuestas)', 'Email interactions (opens, clicks, replies)'],
  ['2.3 Datos de Uso y Actividad', '2.3 Usage and Activity Data'],
  ['Informaci\u00f3n sobre c\u00f3mo navegas y usas el sitio web', 'Information about how you browse and use the website'],
  ['Direcciones IP, tipo de navegador, sistema operativo, idioma', 'IP addresses, browser type, operating system, language'],
  ['P\u00e1ginas visitadas, tiempo de permanencia, patrones de navegaci\u00f3n', 'Pages visited, time on site, browsing patterns'],
  ['Datos de diagn\u00f3stico y rendimiento del sitio', 'Site diagnostics and performance data'],
  ['2.4 Datos Publicitarios', '2.4 Advertising Data'],
  ['Informaci\u00f3n de cookies y p\u00edxeles publicitarios utilizados por Google AdSense y redes publicitarias de terceros', 'Information about cookies and advertising pixels used by Google AdSense and third-party ad networks'],
  ['Datos de interacci\u00f3n con anuncios (impresiones, clics)', 'Ad interaction data (impressions, clicks)'],
  ['ID de publicidad y datos de intereses para anuncios personalizados', 'Advertising ID and interest data for personalized ads'],
  ['2.5 Datos Recopilados Autom\u00e1ticamente', '2.5 Automatically Collected Data'],
  ['Cookies y tecnolog\u00edas similares (ver secci\u00f3n 7)', 'Cookies and similar technologies (see section 7)'],
  ['Datos de uso del dispositivo y de la conexi\u00f3n', 'Device and connection usage data'],
  ['Datos recopilados por servicios de terceros (Firebase Analytics, etc.)', 'Data collected by third-party services (Firebase Analytics, etc.)'],
  ['3. Base Legal para el Tratamiento de Datos', '3. Legal Basis for Data Processing'],
  ['El tratamiento de tu informaci\u00f3n personal se basa en las siguientes bases legales:', 'The processing of your personal information is based on the following legal grounds:'],
  ['Consentimiento', 'Consent'],
  [': Cuando nos das permiso expl\u00edcito para recopilar o usar tus datos, como cuando te suscribes a nuestro bolet\u00edn de correo electr\u00f3nico o aceptas cookies.', ': When you explicitly give us permission to collect or use your data, such as when you subscribe to our newsletter or accept cookies.'],
  ['Inter\u00e9s leg\u00edtimo', 'Legitimate interest'],
  [': Cuando utilizamos tus datos para mejorar nuestros servicios, analizar el rendimiento del sitio, personalizar tu experiencia, mostrar anuncios relevantes o para fines de seguridad.', ': When we use your data to improve our services, analyze site performance, personalize your experience, show relevant ads, or for security purposes.'],
  ['Ejecuci\u00f3n de un contrato', 'Performance of a contract'],
  [': Cuando es necesario para prestarte un servicio solicitado, como responder a una consulta enviada a trav\u00e9s del formulario de contacto.', ': When it is necessary to provide you a requested service, such as responding to an inquiry through the contact form.'],
  ['Obligaci\u00f3n legal', 'Legal obligation'],
  [': Cuando estamos obligados por ley a procesar tus datos, como en cumplimiento de normativas fiscales.', ': When we are required by law to process your data, such as in compliance with tax regulations.'],
  ['4. \u00bfPara Qu\u00e9 Usamos Tus Datos?', '4. What Do We Use Your Data For?'],
  ['Utilizamos la informaci\u00f3n recopilada a trav\u00e9s del sitio web, la', 'We use the information collected through the website, the'],
  ['y nuestros servicios para:', 'and our services to:'],
  ['Responder a tus consultas', 'Respond to your inquiries'],
  [': Procesar y responder mensajes enviados a trav\u00e9s del formulario de contacto.', ': Process and respond to messages sent through the contact form.'],
  ['Enviar comunicaciones por email', 'Send email communications'],
  [': Enviar nuestro bolet\u00edn informativo, contenido promocional y secuencias de bienvenida (solo con tu consentimiento).', ': Send our newsletter, promotional content and welcome sequences (only with your consent).'],
  ['Mostrar anuncios personalizados', 'Show personalized ads'],
  [': Utilizar Google AdSense y redes publicitarias de terceros para mostrar anuncios relevantes basados en tu actividad de navegaci\u00f3n.', ': Use Google AdSense and third-party ad networks to show relevant ads based on your browsing activity.'],
  ['Medir el rendimiento publicitario', 'Measure advertising performance'],
  [': Rastrear impresiones, clics y conversiones de anuncios para optimizar nuestras campa\u00f1as.', ': Track ad impressions, clicks and conversions to optimize our campaigns.'],
  ['Mejorar nuestros servicios', 'Improve our services'],
  [': Analizar patrones de uso, desarrollar nuevas funcionalidades y personalizar la experiencia del usuario.', ': Analyze usage patterns, develop new features and personalize the user experience.'],
  ['Seguridad y prevenci\u00f3n de fraude', 'Security and fraud prevention'],
  [': Detectar y prevenir accesos no autorizados, proteger la integridad de nuestros servicios.', ': Detect and prevent unauthorized access, protect the integrity of our services.'],
  ['Cumplir obligaciones legales', 'Comply with legal obligations'],
  [': Responder requerimientos legales y cumplir con normativas fiscales y regulatorias.', ': Respond to legal requirements and comply with tax and regulatory regulations.'],
  ['5. Con Qui\u00e9nes Compartimos Tus Datos', '5. Who Do We Share Your Data With'],
  ['No vendemos ni alquilamos tu informaci\u00f3n personal. Compartimos datos \u00fanicamente con terceros que nos ayudan a operar nuestro sitio web, la', 'We do not sell or rent your personal information. We only share data with third parties that help us operate our website, the'],
  ['y nuestros servicios, y que cumplen con estrictas medidas de protecci\u00f3n de datos:', 'and our services, and that comply with strict data protection measures:'],
  ['5.1 Proveedores de Servicios Esenciales', '5.1 Essential Service Providers'],
  [': An\u00e1lisis de uso del sitio web y la', ': Analysis of website and'],
  ['(Analytics, Auth, Firestore). Los datos de uso se procesan en los servidores de Google.', '(Analytics, Auth, Firestore). Usage data is processed on Google\u2019s servers.'],
  ['Brevo (antes Sendinblue)', 'Brevo (formerly Sendinblue)'],
  [': Gesti\u00f3n de campa\u00f1as de correo electr\u00f3nico, boletines informativos y secuencias de bienvenida. Tus datos de contacto son almacenados en sus servidores.', ': Management of email campaigns, newsletters and welcome sequences. Your contact data is stored on their servers.'],
  ['5.2 Redes Publicitarias (Google AdSense)', '5.2 Advertising Networks (Google AdSense)'],
  ['Nuestro sitio web utiliza', 'Our website uses'],
  [', un servicio de publicidad en l\u00ednea proporcionado por Google. Google utiliza cookies (incluyendo la cookie', ', an online advertising service provided by Google. Google uses cookies (including the'],
  [') para mostrar anuncios personalizados basados en tu historial de navegaci\u00f3n en este y otros sitios web. Google tambi\u00e9n puede recopilar informaci\u00f3n sobre tus visitas a este sitio y a otros sitios web con el fin de mostrar anuncios sobre productos y servicios que puedan ser de tu inter\u00e9s.', ') to show personalized ads based on your browsing history on this and other websites. Google may also collect information about your visits to this site and other sites in order to show ads about products and services that may be of interest to you.'],
  ['Google, como proveedor externo, utiliza cookies para mostrar anuncios en nuestro sitio. El uso de la cookie DART de Google permite a Google mostrar anuncios a los usuarios que han visitado nuestro sitio web y otros sitios en Internet. Los usuarios pueden optar por no recibir el uso de la cookie DART visitando la', 'Google, as a third-party vendor, uses cookies to show ads on our site. Google\u2019s use of the DART cookie enables Google to show ads to users who have visited our website and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the'],
  ['pol\u00edtica de privacidad de Google', 'Google privacy policy'],
  ['y configurando las preferencias de anuncios.', 'and configuring ad preferences.'],
  ['5.3 Proveedores T\u00e9cnicos', '5.3 Technical Providers'],
  ['Servidores de alojamiento web.', 'Web hosting servers.'],
  ['Proveedores de an\u00e1lisis y m\u00e9tricas de uso.', 'Analytics and usage metrics providers.'],
  ['5.4 Divulgaci\u00f3n Legal', '5.4 Legal Disclosure'],
  ['Podemos divulgar tus datos si estamos obligados por ley, una orden judicial, una requisici\u00f3n gubernamental, o para proteger nuestros derechos, propiedades o seguridad, o los de nuestros usuarios y el p\u00fablico.', 'We may disclose your data if we are required by law, a court order, a government request, or to protect our rights, property or safety, or those of our users and the public.'],
  ['6. Publicidad de Terceros y Partners', '6. Third-Party Advertising and Partners'],
  ['Adem\u00e1s de Google AdSense, este sitio web puede utilizar otras redes publicitarias de terceros que recopilan informaci\u00f3n sobre tus visitas a este y otros sitios web con el fin de mostrar anuncios basados en tus intereses. Estos proveedores pueden utilizar:', 'In addition to Google AdSense, this website may use other third-party ad networks that collect information about your visits to this and other websites in order to show ads based on your interests. These providers may use:'],
  [': Para rastrear tu actividad de navegaci\u00f3n y mostrar anuncios personalizados.', ': To track your browsing activity and show personalized ads.'],
  ['Web beacons / p\u00edxeles', 'Web beacons / pixels'],
  [': Para contar visitas, rastrear conversiones y medir la eficacia de anuncios.', ': To count visits, track conversions and measure ad effectiveness.'],
  ['Identificadores de dispositivo', 'Device identifiers'],
  [': Para reconocer tu dispositivo entre diferentes sitios web.', ': To recognize your device across different websites.'],
  ['Datos de inter\u00e9s', 'Interest data'],
  [': Para segmentar audiencias y mostrar anuncios relevantes.', ': To segment audiences and show relevant ads.'],
  ['Importante:', 'Important:'],
  ['Estos terceros pueden recopilar informaci\u00f3n sobre tu actividad en este sitio web y en otros sitios web para proporcionar anuncios sobre productos y servicios que consideren de tu inter\u00e9s. No tenemos control directo sobre las pr\u00e1cticas de datos de estos proveedores publicitarios de terceros. Te recomendamos revisar las pol\u00edticas de privacidad de cada red publicitaria para obtener m\u00e1s informaci\u00f3n sobre sus pr\u00e1cticas de datos y c\u00f3mo optar por no recibir anuncios personalizados.', 'These third parties may collect information about your activity on this website and on other websites to provide ads about products and services they think may interest you. We have no direct control over the data practices of these third-party advertising providers. We recommend reviewing the privacy policies of each ad network to learn more about their data practices and how to opt out of personalized ads.'],
  ['Los anuncios pueden ser mostrados en diferentes formatos: banners, texto, im\u00e1genes o enlaces. Al hacer clic en un anuncio, puedes ser redirigido al sitio web del anunciante, donde aplicar\u00e1 su propia pol\u00edtica de privacidad.', 'Ads may be shown in different formats: banners, text, images or links. By clicking an ad, you may be redirected to the advertiser\u2019s website, where their own privacy policy will apply.'],
  ['7. Transferencias Internacionales de Datos', '7. International Data Transfers'],
  ['Tus datos pueden ser transferidos, almacenados y procesados en servidores ubicados en Estados Unidos u otros pa\u00edses fuera de tu jurisdicci\u00f3n al usar el sitio web o la', 'Your data may be transferred, stored and processed on servers located in the United States or other countries outside your jurisdiction when using the website or the'],
  ['. Firebase (Google) y los servicios de Google operan bajo el', '. Firebase (Google) and Google services operate under the'],
  ['Marco de Certificaci\u00f3n EU-U.S. Data Privacy Framework', 'EU-U.S. Data Privacy Framework'],
  [', lo que garantiza una protecci\u00f3n adecuada de los datos transferidos desde la Uni\u00f3n Europea y Suiza. Brevo opera bajo el marco EU-US Privacy Shield para transferencias de datos personales desde la UE. Google AdSense procesa datos de usuarios en servidores ubicados en Estados Unidos conforme a las pol\u00edticas de Google.', ', which ensures adequate protection for data transferred from the European Union and Switzerland. Brevo operates under the EU-US Privacy Shield framework for personal data transfers from the EU. Google AdSense processes user data on servers located in the United States in accordance with Google\u2019s policies.'],
  ['8. Retenci\u00f3n de Datos', '8. Data Retention'],
  ['Conservamos tus datos personales durante el tiempo necesario para cumplir con las finalidades descritas en esta pol\u00edtica:', 'We keep your personal data for as long as necessary to fulfill the purposes described in this policy:'],
  ['Datos de contacto:', 'Contact data:'],
  ['Mientras mantengamos una relaci\u00f3n comercial o hasta que solicites su eliminaci\u00f3n.', 'As long as we have a business relationship or until you request its deletion.'],
  ['Datos de suscripci\u00f3n por email:', 'Email subscription data:'],
  ['Hasta que revoques tu consentimiento o solicites la baja.', 'Until you withdraw your consent or request unsubscribe.'],
  ['Datos de uso del sitio:', 'Site usage data:'],
  ['Hasta 30 meses para an\u00e1lisis estad\u00edstico, luego anonimizados.', 'Up to 30 months for statistical analysis, then anonymized.'],
  ['Emails de marketing:', 'Marketing emails:'],
  ['Si tu cuenta o suscripci\u00f3n permanece inactiva durante m\u00e1s de 24 meses, podremos proceder a su eliminaci\u00f3n o desactivaci\u00f3n.', 'If your account or subscription remains inactive for more than 24 months, we may proceed to delete or deactivate it.'],
  ['9. Cookies y Tecnolog\u00edas Similares', '9. Cookies and Similar Technologies'],
  ['Utilizamos cookies y tecnolog\u00edas similares en el sitio web y la', 'We use cookies and similar technologies on the website and the'],
  ['para:', 'to:'],
  ['Cookies esenciales:', 'Essential cookies:'],
  ['Para el funcionamiento del sitio web (sesi\u00f3n, autenticaci\u00f3n, preferencias de idioma).', 'For the operation of the website (session, authentication, language preferences).'],
  ['Cookies de an\u00e1lisis:', 'Analytics cookies:'],
  ['Firebase Analytics para entender c\u00f3mo los usuarios interact\u00faan con nuestro sitio web y la', 'Firebase Analytics to understand how users interact with our website and the'],
  ['Cookies de publicidad:', 'Advertising cookies:'],
  ['Google AdSense y redes publicitarias de terceros utilizan cookies para mostrar anuncios personalizados, medir la eficacia de las campa\u00f1as y evitar mostrar los mismos anuncios repetidamente.', 'Google AdSense and third-party ad networks use cookies to show personalized ads, measure campaign effectiveness and avoid showing the same ads repeatedly.'],
  ['Cookies de preferencias:', 'Preference cookies:'],
  ['Para recordar tu idioma preferido y configuraciones.', 'To remember your preferred language and settings.'],
  ['Cookies de marketing:', 'Marketing cookies:'],
  ['Para mostrar contenido relevante y medir campa\u00f1as de email (solo con consentimiento).', 'To show relevant content and measure email campaigns (only with consent).'],
  ['Puedes gestionar tus preferencias de cookies en cualquier momento a trav\u00e9s de la configuraci\u00f3n de tu navegador. Ten en cuenta que al desactivar las cookies esenciales, partes de nuestro sitio web pueden no funcionar correctamente. Tambi\u00e9n puedes gestionar tus preferencias de cookies con Brevo a trav\u00e9s de su pol\u00edtica de privacidad.', 'You can manage your cookie preferences at any time through your browser settings. Keep in mind that by disabling essential cookies, parts of our website may not work correctly. You can also manage your cookie preferences with Brevo through their privacy policy.'],
  ['Opci\u00f3n de exclusi\u00f3n voluntaria (Opt-out):', 'Opt-out option:'],
  ['Puedes optar por no recibir anuncios personalizados de Google AdSense visitando la', 'You can opt out of personalized Google AdSense ads by visiting'],
  ['Configuraci\u00f3n de anuncios de Google', 'Google Ads Settings'],
  ['o descargando el', 'or downloading the'],
  ['complemento de exclusi\u00f3n voluntaria de Google Analytics', 'Google Analytics opt-out add-on'],
  ['. Tambi\u00e9n puedes optar por no recibir anuncios personalizados de otras redes publicitarias a trav\u00e9s del programa', '. You can also opt out of personalized ads from other ad networks through the'],
  ['o la', 'or the'],
  ['herramienta de elecci\u00f3n de anuncios de Digital Advertising Alliance', 'Digital Advertising Alliance opt-out tool'],
  ['10. Tus Derechos de Privacidad (GDPR / LOPD)', '10. Your Privacy Rights (GDPR / LOPD)'],
  ['Dependiendo de tu jurisdicci\u00f3n, tienes los siguientes derechos:', 'Depending on your jurisdiction, you have the following rights:'],
  ['Derecho de acceso:', 'Right of access:'],
  ['Solicitar y recibir una copia de los datos personales que tenemos sobre ti.', 'Request and receive a copy of the personal data we hold about you.'],
  ['Derecho de rectificaci\u00f3n:', 'Right to rectification:'],
  ['Corregir datos personales inexactos o incompletos.', 'Correct inaccurate or incomplete personal data.'],
  ['Derecho de supresi\u00f3n:', 'Right to erasure:'],
  ['Solicitar la eliminaci\u00f3n de tus datos personales ("derecho al olvido").', 'Request the deletion of your personal data ("right to be forgotten").'],
  ['Derecho de portabilidad:', 'Right to data portability:'],
  ['Recibir tus datos en un formato estructurado y solicitar su transferencia a otro responsable.', 'Receive your data in a structured format and request its transfer to another controller.'],
  ['Derecho de oposici\u00f3n:', 'Right to object:'],
  ['Oponerte al tratamiento de tus datos, especialmente para fines de marketing directo y publicidad personalizada.', 'Object to the processing of your data, especially for direct marketing and personalized advertising.'],
  ['Derecho a limitar el tratamiento:', 'Right to restrict processing:'],
  ['Restringir el procesamiento de tus datos en ciertas circunstancias.', 'Restrict the processing of your data in certain circumstances.'],
  ['Derecho a no ser objeto de decisiones automatizadas:', 'Right not to be subject to automated decisions:'],
  ['No estar sujeto a decisiones basadas \u00fanicamente en procesamiento automatizado.', 'Not be subject to decisions based solely on automated processing.'],
  ['Derecho de revocar el consentimiento:', 'Right to withdraw consent:'],
  ['Retirar tu consentimiento en cualquier momento sin afectar la licitud del tratamiento previo.', 'Withdraw your consent at any time without affecting the lawfulness of previous processing.'],
  ['Derecho a presentar una reclamaci\u00f3n:', 'Right to lodge a complaint:'],
  ['Contactar a tu autoridad de protecci\u00f3n de datos local.', 'Contact your local data protection authority.'],
  ['Para ejercer cualquiera de estos derechos, env\u00eda una solicitud a', 'To exercise any of these rights, send a request to'],
  ['. Responderemos dentro de los 30 d\u00edas h\u00e1biles siguientes. Verificaremos tu identidad antes de procesar cualquier solicitud.', '. We will respond within the next 30 business days. We will verify your identity before processing any request.'],
  ['11. Derechos de Residentes de California (CCPA)', "11. California Residents' Rights (CCPA)"],
  ['Si resides en California (Estados Unidos), tienes los siguientes derechos adicionales bajo la', 'If you reside in California (United States), you have the following additional rights under the'],
  ['Derecho a saber:', 'Right to know:'],
  ['Solicitar las categor\u00edas y las piezas espec\u00edficas de datos personales que hemos recopilado, utilizado, divulgado y vendido.', 'Request the categories and specific pieces of personal data we have collected, used, disclosed and sold.'],
  ['Derecho a no vender:', 'Right to opt out of the sale:'],
  ['Oponerte a la venta de tus datos personales a terceros. Puedes ejercer este derecho haciendo clic en', 'Object to the sale of your personal data to third parties. You can exercise this right by clicking'],
  ['o contact\u00e1ndonos en', 'or contacting us at'],
  ['Derecho a eliminar:', 'Right to deletion:'],
  ['Solicitar la eliminaci\u00f3n de datos personales que hayamos recopilado de ti.', 'Request deletion of personal data we have collected from you.'],
  ['Derecho a no ser discriminado:', 'Right not to be discriminated against:'],
  ['No seremos discriminados por ejercer tus derechos bajo la CCPA.', 'We will not discriminate against you for exercising your rights under the CCPA.'],
  ['Este sitio web no vende datos personales a terceros. Los datos recopilados a trav\u00e9s de Firebase Analytics y Google AdSense se utilizan \u00fanicamente para fines anal\u00edticos y publicitarios, en cumplimiento con las pol\u00edticas de Google.', 'This website does not sell personal data to third parties. Data collected through Firebase Analytics and Google AdSense is used solely for analytical and advertising purposes, in compliance with Google\u2019s policies.'],
  ['12. Medidas de Seguridad', '12. Security Measures'],
  ['Implementamos medidas t\u00e9cnicas y organizativas apropiadas para proteger tus datos personales contra acceso no autorizado, alteraci\u00f3n, divulgaci\u00f3n o destrucci\u00f3n, tanto en el sitio web como en la', 'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure or destruction, both on the website and in the'],
  ['. Estas medidas incluyen:', '. These measures include:'],
  ['Cifrado de datos en tr\u00e1nsito (TLS/SSL).', 'Data encryption in transit (TLS/SSL).'],
  ['Control de acceso basado en roles para el personal interno.', 'Role-based access control for internal staff.'],
  ['Monitoreo continuo de seguridad y detecci\u00f3n de intrusiones.', 'Continuous security monitoring and intrusion detection.'],
  ['Pol\u00edticas de privacidad y seguridad para todo el personal con acceso a datos.', 'Privacy and security policies for all staff with access to data.'],
  ['Evaluaciones peri\u00f3dicas de riesgos y auditor\u00edas de seguridad.', 'Periodic risk assessments and security audits.'],
  ['Ten en cuenta que ning\u00fan m\u00e9todo de transmisi\u00f3n por Internet o almacenamiento electr\u00f3nico es 100% seguro. Aunque nos esforzamos por utilizar medios comercialmente aceptables para proteger tu informaci\u00f3n, no podemos garantizar su seguridad absoluta.', 'Please note that no method of Internet transmission or electronic storage is 100% secure. Although we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.'],
  ['12B. Datos Recopilados en la Kore App', '12B. Data Collected in the Kore App'],
  ['Al usar la', 'When using the'],
  [', recopilamos los siguientes datos espec\u00edficos:', ', we collect the following specific data:'],
  ['12B.1 Datos de Cuenta y Autenticaci\u00f3n', '12B.1 Account and Authentication Data'],
  ['Correo electr\u00f3nico, nombre y foto de perfil (Firebase Auth, Google Sign-In, Facebook Login)', 'Email, name and profile photo (Firebase Auth, Google Sign-In, Facebook Login)'],
  ['UID de Firebase, tokens de autenticaci\u00f3n', 'Firebase UID, authentication tokens'],
  ['12B.2 Datos de Uso de la App', '12B.2 App Usage Data'],
  ['Tareas, h\u00e1bitos, notas, diario, eventos de calendario (almacenados localmente en Room + sincronizados en Firestore si hay sesi\u00f3n)', 'Tasks, habits, notes, diary, calendar events (stored locally in Room + synced to Firestore when signed in)'],
  ['Preferencias de notificaciones, sonido, vibraci\u00f3n, idioma (DataStore local)', 'Notification, sound, vibration, language preferences (local DataStore)'],
  ['Estado premium/suscripci\u00f3n (Google Play Billing)', 'Premium/subscription status (Google Play Billing)'],
  ['12B.3 Datos T\u00e9cnicos y de Diagn\u00f3stico', '12B.3 Technical and Diagnostic Data'],
  ['Firebase Analytics: eventos de pantalla, acciones, errores, rendimiento', 'Firebase Analytics: screen events, actions, errors, performance'],
  ['Firebase Crashlytics: reportes de fallos (si habilitado)', 'Firebase Crashlytics: crash reports (if enabled)'],
  ['Identificadores de dispositivo (Firebase Instance ID, Android ID)', 'Device identifiers (Firebase Instance ID, Android ID)'],
  ['12B.4 Notificaciones', '12B.4 Notifications'],
  ['Token FCM para notificaciones push (opt-in, desactivado por defecto)', 'FCM token for push notifications (opt-in, disabled by default)'],
  ['Horarios y preferencias de frases motivadoras y eventos', 'Schedules and preferences for motivational phrases and events'],
  ['Todos los datos personales se almacenan de forma segura (TLS en tr\u00e1nsito, cifrado en reposo en Firestore/Room) y puedes solicitarnos su eliminaci\u00f3n en cualquier momento.', 'All personal data is stored securely (TLS in transit, encrypted at rest in Firestore/Room) and you can request its deletion at any time.'],
  ['12C. Derechos de Propiedad Intelectual y M\u00fasica', '12C. Intellectual Property and Music Rights'],
  ['Todas las pistas musicales incluidas en la aplicaci\u00f3n Kore son propiedad intelectual exclusiva de', 'All music tracks included in the Kore application are the exclusive intellectual property of'],
  ['. El contenido musical fue generado utilizando herramientas de inteligencia artificial bajo una licencia comercial otorgada a Alquimia Lab, lo que nos confiere los derechos necesarios para su distribuci\u00f3n y uso en la aplicaci\u00f3n.', '. The music content was generated using artificial intelligence tools under a commercial license granted to Alquimia Lab, which gives us the necessary rights for its distribution and use in the application.'],
  ['No se utiliza m\u00fasica de terceros sin la debida autorizaci\u00f3n. Los nombres de las pistas, las car\u00e1tulas y la informaci\u00f3n asociada son marcas y contenido registrado de Alquimia Lab.', 'No third-party music is used without proper authorization. Track names, covers and associated information are trademarks and registered content of Alquimia Lab.'],
  ['Queda prohibida la redistribuci\u00f3n, reproducci\u00f3n o uso comercial del contenido musical sin el consentimiento previo y por escrito de Alquimia Lab. Para solicitudes de licencia o atribuci\u00f3n, contactarnos en', 'Redistribution, reproduction or commercial use of the music content is prohibited without the prior written consent of Alquimia Lab. For license or attribution requests, contact us at'],
  ['13. Menores de Edad', '13. Minors'],
  ['Nuestros servicios no est\u00e1n dirigidos a menores de 16 a\u00f1os (o la edad equivalente seg\u00fan la jurisdicci\u00f3n aplicable). No recopilamos intencionalmente informaci\u00f3n personal de menores de edad. Si descubrimos que hemos recopilado datos de un menor sin verificaci\u00f3n parental, tomaremos medidas para eliminar dicha informaci\u00f3n de nuestros registros. Los padres o tutores legales pueden contactarnos en', 'Our services are not directed at children under 16 (or the equivalent age under applicable jurisdiction). We do not knowingly collect personal information from minors. If we discover that we have collected data from a minor without parental verification, we will take steps to delete that information from our records. Parents or legal guardians can contact us at'],
  ['para solicitar la eliminaci\u00f3n de datos de menores.', "to request deletion of a minor's data."],
  ['14. Cambios a esta Pol\u00edtica de Privacidad', '14. Changes to this Privacy Policy'],
  ['Podemos actualizar esta Pol\u00edtica de Privacidad de vez en cuando. Te notificaremos cualquier cambio significativo a trav\u00e9s de:', 'We may update this Privacy Policy from time to time. We will notify you of any significant change through:'],
  ['Un banner destacado en nuestro sitio web.', 'A prominent banner on our website.'],
  ['Publicaci\u00f3n de la nueva versi\u00f3n con la fecha de "\u00daltima actualizaci\u00f3n" actualizada.', 'Publishing the new version with the "Last updated" date revised.'],
  ['Te recomendamos revisar esta pol\u00edtica peri\u00f3dicamente. El uso continuado de nuestros servicios despu\u00e9s de cualquier cambio constituye tu aceptaci\u00f3n de las nuevas pr\u00e1cticas descritas.', 'We recommend reviewing this policy periodically. Your continued use of our services after any change constitutes your acceptance of the new practices described.'],
  ['15. C\u00f3mo Contactarnos', '15. How to Contact Us'],
  ['Si tienes preguntas, solicitudes o inquietudes sobre esta Pol\u00edtica de Privacidad o el tratamiento de tus datos personales, puedes contactarnos:', 'If you have questions, requests or concerns about this Privacy Policy or the processing of your personal data, you can contact us:'],
  ['Correo electr\u00f3nico:', 'Email:'],
  ['Formulario de contacto:', 'Contact form:'],
  ['Eliminar datos Kore:', 'Delete Kore data:'],
  ['Solicitar eliminaci\u00f3n de datos', 'Request data deletion'],
  ['Domicilio:', 'Address:'],
  ['Tambi\u00e9n tienes derecho a presentar una reclamaci\u00f3n ante la autoridad de protecci\u00f3n de datos de tu jurisdicci\u00f3n. En Colombia, puedes contactar a la', 'You also have the right to lodge a complaint with the data protection authority of your jurisdiction. In Colombia, you can contact the'],
  ['Superintendencia de Industria y Comercio (SIC)', 'Superintendency of Industry and Commerce (SIC)'],
  ['\u00daltima actualizaci\u00f3n:', 'Last updated:'],
  ['21 de Septiembre de 2026', 'September 21, 2026'],
  ['Al utilizar nuestros servicios despu\u00e9s de la publicaci\u00f3n de cualquier cambio, aceptas la versi\u00f3n revisada de esta Pol\u00edtica de Privacidad.', 'By using our services after the publication of any change, you accept the revised version of this Privacy Policy.'],
  ['Orden, Tranquilidad y Autonom\u00eda para tu d\u00eda a d\u00eda.', 'Order, tranquility and autonomy for your day to day.'],
  ['Enlaces', 'Links'],
  ['&copy; 2026 Alquimia Lab \u00b7 Hecho con calma y caf\u00e9', '\u00a9 2026 Alquimia Lab \u00b7 Made with calm & coffee'],

  // ---------- delete-account.html ----------
  ['Eliminar mis datos \u00b7 Kore \u00b7 Alquimia Lab', 'Delete my data \u00b7 Kore \u00b7 Alquimia Lab'],
  ['Tu espacio de calma', 'Your calm space'],
  ['En desarrollo', 'In development'],
  ['Pr\u00f3ximamente en Google Play', 'Coming soon on Google Play'],
  ['Kore est\u00e1 en fase final de desarrollo. Ser\u00e1 tu espacio personal de calma: tareas, h\u00e1bitos, notas, diario, m\u00fasica relajante y chat con Antonio (IA).', 'Kore is in its final development phase. It will be your personal calm space: tasks, habits, notes, diary, relaxing music and chat with Antonio (AI).'],
  ['\ud83d\udccb Tareas & H\u00e1bitos', '\ud83d\udccb Tasks & Habits'],
  ['\ud83d\udcdd Notas & Diario', '\ud83d\udcdd Notes & Diary'],
  ['\ud83c\udfb5 M\u00fasica Relajante', '\ud83c\udfb5 Relaxing Music'],
  ['\ud83e\udd16 Chat IA (Antonio)', '\ud83e\udd16 AI Chat (Antonio)'],
  ['\u00bfDeseas eliminar tus datos de Kore?', 'Do you want to delete your Kore data?'],
  ['\ud83d\uddd1\ufe0f Eliminar mis datos', '\ud83d\uddd1\ufe0f Delete my data'],
  ['\u00bfQu\u00e9 se elimina?', 'What gets deleted?'],
  ['Cuenta de autenticaci\u00f3n (Firebase Auth)', 'Authentication account (Firebase Auth)'],
  ['Datos de perfil: nombre, email, foto', 'Profile data: name, email, photo'],
  ['Tareas, h\u00e1bitos, notas, diario, eventos', 'Tasks, habits, notes, diary, events'],
  ['Preferencias: notificaciones, idioma, tema', 'Preferences: notifications, language, theme'],
  ['Historial de chat con Antonio (IA)', 'Chat history with Antonio (AI)'],
  ['Datos de uso y analytics (Firebase)', 'Usage and analytics data (Firebase)'],
  ['Suscripci\u00f3n/estado premium (Google Play Billing)', 'Subscription/premium status (Google Play Billing)'],
  ['Esta acci\u00f3n es irreversible.', 'This action is irreversible.'],
  ['Solicitar eliminaci\u00f3n', 'Request deletion'],
  ['Email asociado a Kore *', 'Email associated with Kore *'],
  ['UID de Firebase (opcional)', 'Firebase UID (optional)'],
  ['Confirmo que quiero eliminar mis datos permanentemente *', 'I confirm I want to permanently delete my data *'],
  ['Mensaje adicional (opcional)', 'Additional message (optional)'],
  ['\ud83d\uddd1\ufe0f Enviar solicitud de eliminaci\u00f3n', '\ud83d\uddd1\ufe0f Send deletion request'],
  ['Procesaremos tu solicitud en', 'We will process your request within'],
  ['30 d\u00edas h\u00e1biles', '30 business days'],
  ['\u26a0\ufe0f Antes de enviar, ten en cuenta:', '\u26a0\ufe0f Before sending, please note:'],
  ['La eliminaci\u00f3n es', 'The deletion is'],
  ['permanente e irreversible', 'permanent and irreversible'],
  ['Perder\u00e1s acceso a todas tus tareas, h\u00e1bitos, notas, diario, chat y m\u00fasica.', 'You will lose access to all your tasks, habits, notes, diary, chat and music.'],
  ['Tu suscripci\u00f3n premium se cancelar\u00e1 sin reembolso.', 'Your premium subscription will be cancelled without refund.'],
  ['Los datos de facturaci\u00f3n de Google Play se conservan por ley fiscal.', 'Google Play billing data will be retained as required by tax law.'],
  ['Recibir\u00e1s email de confirmaci\u00f3n cuando se complete.', 'You will receive a confirmation email when it is complete.'],
  ['\u2190 Volver a Kore', '\u2190 Back to Kore'],
  ['Pol\u00edtica de Privacidad', 'Privacy Policy'],
  ['\u00a9 2026 Alquimia Lab \u00b7 Hecho con calma y caf\u00e9', '\u00a9 2026 Alquimia Lab \u00b7 Made with calm & coffee'],
];

/* ====== PARES solo para zonas de etiqueta (atributos) ====== */
const TAGS = [
  ['aria-label="Cambiar idioma"', 'aria-label="Switch language"'],
  ['aria-label="Men\u00fa"', 'aria-label="Menu"'],
  ['<html lang="es">', '<html lang="en">'],
  ['content="Alquimia Lab \u00b7 Pol\u00edtica de Privacidad. Informaci\u00f3n sobre recopilaci\u00f3n de datos, uso de cookies, derechos de los usuarios y m\u00e1s."',
   'content="Alquimia Lab \u00b7 Privacy Policy. Information about data collection, cookie use, user rights and more."'],
  ['content="Solicita la eliminaci\u00f3n de tus datos personales en Kore."',
   'content="Request deletion of your personal data in Kore."'],
  ['placeholder="tu@email.com"', 'placeholder="your@email.com"'],
  ['placeholder="Motivo, comentarios..."', 'placeholder="Reason, comments..."'],
];

/* ====== Entradas nuevas para lang.js ====== */
const TITLE_ENT = [
  ['Privacy Policy \u00b7 Alquimia Lab', 'Pol\u00edtica de Privacidad \u00b7 Alquimia Lab'],
  ['Delete my data \u00b7 Kore \u00b7 Alquimia Lab', 'Eliminar mis datos \u00b7 Kore \u00b7 Alquimia Lab'],
];
const DESC_ENT = [
  ['Alquimia Lab \u00b7 Privacy Policy. Information about data collection, cookie use, user rights and more.',
   'Alquimia Lab \u00b7 Pol\u00edtica de Privacidad. Informaci\u00f3n sobre recopilaci\u00f3n de datos, uso de cookies, derechos de los usuarios y m\u00e1s.'],
  ['Request deletion of your personal data in Kore.', 'Solicita la eliminaci\u00f3n de tus datos personales en Kore.'],
];
const PLACE_ENT = [
  ['your@email.com', 'tu@email.com'],
  ['Reason, comments...', 'Motivo, comentarios...'],
];

/* ======================= aplicar ======================= */
const P = a => a.slice().sort((x, y) => y[0].length - x[0].length);
const textPairs = P(PAIRS);
const tagPairs = P(TAGS);

function convert(file) {
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  if (/<title>Privacy Policy|<title>Delete my data/.test(html)) {
    console.log('\u00b7 ' + file + ': ya estaba en EN, se omite');
    return null;
  }
  const stash = [];
  html = html.replace(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->)/gi,
    m => { stash.push(m); return '\u0000' + (stash.length - 1) + '\u0000'; });

  const parts = html.split(/(<[^>]+>)/);
  const zero = [];
  const hitT = new Array(tagPairs.length).fill(0);
  const hitX = new Array(textPairs.length).fill(0);
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      for (let k = 0; k < tagPairs.length; k++) {
        const [es, en] = tagPairs[k];
        if (parts[i].indexOf(es) > -1) {
          hitT[k] += parts[i].split(es).length - 1;
          parts[i] = parts[i].split(es).join(en);
        }
      }
    } else {
      for (let k = 0; k < textPairs.length; k++) {
        const [es, en] = textPairs[k];
        if (parts[i].indexOf(es) > -1) {
          hitX[k] += parts[i].split(es).length - 1;
          parts[i] = parts[i].split(es).join(en);
        }
      }
    }
  }
  html = parts.join('').replace(/\u0000(\d+)\u0000/g, (m, n) => stash[+n]);

  if (!/rel="canonical"/.test(html)) {
    html = html.replace(/<\/title>\r?\n/,
      '</title>\n  <link rel="canonical" href="https://alquimialab.app/' + file + '">\n');
  }
  fs.writeFileSync(full, html, 'utf8');

  for (let k = 0; k < tagPairs.length; k++) if (hitT[k] === 0) zero.push('[attr] ' + tagPairs[k][0].slice(0, 70));
  for (let k = 0; k < textPairs.length; k++) if (hitX[k] === 0) zero.push('[txt ] ' + textPairs[k][0].slice(0, 70));
  console.log(file + ': pares aplicados ' + textPairs.filter((_, k) => hitX[k] > 0).length + '/' + textPairs.length +
    ' texto, ' + tagPairs.filter((_, k) => hitT[k] > 0).length + '/' + tagPairs.length + ' atributos');
  return zero;
}

/* ======================= lang.js ======================= */
function objAfter(src, marker) {
  const s = src.indexOf(marker);
  if (s < 0) throw new Error('marker no encontrado: ' + marker);
  const o = src.indexOf('{', s);
  let d = 0;
  for (let i = o; i < src.length; i++) {
    if (src[i] === '{') d++;
    else if (src[i] === '}') {
      d--;
      if (d === 0) return eval('(' + src.slice(o, i + 1).replace(/\/\*[\s\S]*?\*\//g, '') + ')');
    }
  }
  return {};
}

function insertBlock(src, marker, entries) {
  if (entries.length === 0) return src;
  const i = src.indexOf(marker);
  if (i < 0) throw new Error('marker no encontrado: ' + marker);
  const at = i + marker.length;
  const lines = entries.map(([k, v]) => '    ' + JSON.stringify(k) + ': ' + JSON.stringify(v) + ',');
  return src.slice(0, at) + '\n' + lines.join('\n') + src.slice(at);
}

function newEntries(pairs) {
  const out = [];
  for (const [en, es] of pairs) {
    if (Object.prototype.hasOwnProperty.call(existing, en)) {
      if (existing[en] !== es) console.log('AVISO valor distinto para clave existente: ' + JSON.stringify(en));
      continue;
    }
    out.push([en, es]);
  }
  return out;
}

let allZero = [];
for (const f of ['politica-privacidad.html', 'delete-account.html']) {
  const z = convert(f);
  if (z) allZero = allZero.concat(z.map(s => f + ' -> ' + s));
}

const langPath = path.join(ROOT, 'js/lang.js');
let lang = fs.readFileSync(langPath, 'utf8');

let existing = objAfter(lang, 'var dict = {');
const dictEnt = [];
for (const [es, en] of PAIRS) {
  const k = decode(en), v = decode(es);
  if (Object.prototype.hasOwnProperty.call(existing, k)) {
    if (existing[k] !== v) console.log('AVISO dict: clave existente con otro valor: ' + JSON.stringify(k));
    continue;
  }
  if (dictEnt.some(e => e[0] === k)) continue;
  dictEnt.push([k, v]);
}

existing = objAfter(lang, 'var titles = {');
const titleEnt = newEntries(TITLE_ENT);
existing = objAfter(lang, 'var descriptions = {');
const descEnt = newEntries(DESC_ENT);
existing = objAfter(lang, 'var placeholders = {');
const placeEnt = newEntries(PLACE_ENT);

lang = insertBlock(lang, 'var dict = {', dictEnt);
lang = insertBlock(lang, 'var titles = {', titleEnt);
lang = insertBlock(lang, 'var descriptions = {', descEnt);
lang = insertBlock(lang, 'var placeholders = {', placeEnt);
fs.writeFileSync(langPath, lang, 'utf8');

console.log('\nlang.js: +dict ' + dictEnt.length + ', +titles ' + titleEnt.length +
  ', +descriptions ' + descEnt.length + ', +placeholders ' + placeEnt.length);
if (allZero.length) {
  console.log('\n--- PARES SIN COINCIDENCIA (' + allZero.length + ') ---');
  allZero.forEach(z => console.log(' \u2022 ' + z));
} else {
  console.log('\nTodos los pares tuvieron coincidencia.');
}
console.log('LISTO');
