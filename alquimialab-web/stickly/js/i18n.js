/* ==========================================================================
   Stickly · i18n
   BASE viene de la app Android (ya traducido a 9 idiomas).
   EXTRA contiene las cadenas nuevas de la PWA.
   ========================================================================== */

import { BASE } from "./i18n-base.js";
import { EXTRA as EXTRA_PWA } from "./i18n-extra.js";

export const LANGS = ["es", "en", "fr", "it", "pt", "de", "ja", "zh", "ko"];

export const LANG_LABELS = {
  es: "Español",
  en: "English",
  fr: "Français",
  it: "Italiano",
  pt: "Português",
  de: "Deutsch",
  ja: "日本語",
  zh: "中文",
  ko: "한국어"
};

/* clave: { es, en, fr, it, pt, de, ja, zh, ko } */
const EXTRA = {
  tagline: {
    es: "Tus notas, tareas y contraseñas, en orden.",
    en: "Your notes, tasks and passwords, in order.",
    fr: "Vos notes, tâches et mots de passe, en ordre.",
    it: "Note, attività e password, in ordine.",
    pt: "Suas notas, tarefas e senhas, em ordem.",
    de: "Deine Notizen, Aufgaben und Passwörter, in Ordnung.",
    ja: "ノートもタスクもパスワードも、ひとつに整えて。",
    zh: "笔记、任务和密码，井然有序。",
    ko: "노트, 할 일, 비밀번호를 한곳에 정리하세요."
  },
  onbEyebrow: {
    es: "Bienvenida a Stickly",
    en: "Welcome to Stickly",
    fr: "Bienvenue dans Stickly",
    it: "Benvenuta in Stickly",
    pt: "Bem-vinda ao Stickly",
    de: "Willkommen bei Stickly",
    ja: "Sticklyへようこそ",
    zh: "欢迎使用 Stickly",
    ko: "Stickly에 오신 것을 환영해요"
  },
  onbTitle: {
    es: "Tu día, en orden\ny en un solo lugar.",
    en: "Your day, in order,\nall in one place.",
    fr: "Ta journée, en ordre\net au même endroit.",
    it: "La tua giornata, in ordine\ne in un solo posto.",
    pt: "Seu dia, em ordem\ne em um só lugar.",
    de: "Dein Tag, geordnet\nund an einem Ort.",
    ja: "あなたの一日を、\nひとつの場所に。",
    zh: "你的一天，\n井然有序，都在一处。",
    ko: "당신의 하루를,\n한곳에 정리하세요."
  },
  onb1t: {
    es: "Todo queda en tu dispositivo",
    en: "Everything stays on your device",
    fr: "Tout reste sur ton appareil",
    it: "Tutto resta sul tuo dispositivo",
    pt: "Tudo fica no seu dispositivo",
    de: "Alles bleibt auf deinem Gerät",
    ja: "すべて端末の中に",
    zh: "一切保存在你的设备上",
    ko: "모든 데이터는 기기에 저장됩니다"
  },
  onb1d: {
    es: "Tus notas, tareas y contraseñas se guardan localmente. Sin cuenta y sin servidores.",
    en: "Your notes, tasks and passwords are stored locally. No account, no servers.",
    fr: "Tes notes, tâches et mots de passe sont stockés localement. Sans compte ni serveur.",
    it: "Note, attività e password restano sul dispositivo. Senza account né server.",
    pt: "Suas notas, tarefas e senhas ficam no dispositivo. Sem conta e sem servidores.",
    de: "Notizen, Aufgaben und Passwörter bleiben lokal. Kein Konto, keine Server.",
    ja: "ノートもタスクもパスワードも端末内に保存。アカウントもサーバーも不要です。",
    zh: "笔记、任务和密码都保存在本地。无需账号，也没有服务器。",
    ko: "노트, 할 일, 비밀번호는 기기에 저장됩니다. 계정도 서버도 필요 없어요."
  },
  onb2t: {
    es: "Privado de verdad",
    en: "Truly private",
    fr: "Vraiment privé",
    it: "Davvero privato",
    pt: "De verdade privado",
    de: "Wirklich privat",
    ja: "本当のプライバシー",
    zh: "真正的私密",
    ko: "진짜 비밀"
  },
  onb2d: {
    es: "Tus contraseñas y notas privadas se cifran con tu PIN. Ni siquiera yo puedo leerlas.",
    en: "Your passwords and private notes are encrypted with your PIN. Not even I can read them.",
    fr: "Tes mots de passe et notes privées sont chiffrés avec ton PIN. Même moi, je ne peux pas les lire.",
    it: "Password e note private sono cifrate con il tuo PIN. Nemmeno io posso leggerle.",
    pt: "Suas senhas e notas privadas são criptografadas com seu PIN. Nem eu consigo lê-las.",
    de: "Passwörter und private Notizen werden mit deiner PIN verschlüsselt. Nicht einmal ich kann sie lesen.",
    ja: "パスワードとプライベートノートはPINで暗号化。私にも読めません。",
    zh: "密码和私密笔记用你的 PIN 加密，连我也读不到。",
    ko: "비밀번호와 비공개 노트는 PIN으로 암호화됩니다. 저도 읽을 수 없어요."
  },
  onb3t: {
    es: "Instálala como app",
    en: "Install it as an app",
    fr: "Installe-la comme une app",
    it: "Installala come app",
    pt: "Instale como app",
    de: "Als App installieren",
    ja: "アプリとしてインストール",
    zh: "安装为应用",
    ko: "앱으로 설치하세요"
  },
  onb3d: {
    es: "Añádela a tu pantalla de inicio y úsala sin conexión, como cualquier app.",
    en: "Add it to your home screen and use it offline, like any other app.",
    fr: "Ajoute-la à ton écran d'accueil et utilise-la hors ligne, comme une app.",
    it: "Aggiungila alla schermata Home e usala offline, come un'app.",
    pt: "Adicione à tela inicial e use offline, como qualquer app.",
    de: "Zum Startbildschirm hinzufügen und offline nutzen, wie jede App.",
    ja: "ホーム画面に追加すれば、オフラインでもアプリのように使えます。",
    zh: "添加到主屏幕，离线也能像应用一样使用。",
    ko: "홈 화면에 추가하면 오프라인에서도 앱처럼 사용할 수 있어요."
  },
  start: {
    es: "Empezar",
    en: "Get started",
    fr: "Commencer",
    it: "Inizia",
    pt: "Começar",
    de: "Loslegen",
    ja: "はじめる",
    zh: "开始使用",
    ko: "시작하기"
  },
  skip: {
    es: "Ahora no",
    en: "Not now",
    fr: "Pas maintenant",
    it: "Non ora",
    pt: "Agora não",
    de: "Nicht jetzt",
    ja: "あとで",
    zh: "以后再说",
    ko: "나중에"
  },
  search: {
    es: "Buscar",
    en: "Search",
    fr: "Rechercher",
    it: "Cerca",
    pt: "Buscar",
    de: "Suchen",
    ja: "検索",
    zh: "搜索",
    ko: "검색"
  },
  searchNotes: {
    es: "Buscar en tus notas…",
    en: "Search your notes…",
    fr: "Rechercher dans tes notes…",
    it: "Cerca nelle note…",
    pt: "Buscar nas notas…",
    de: "Notizen durchsuchen…",
    ja: "ノートを検索…",
    zh: "搜索笔记…",
    ko: "노트 검색…"
  },
  noResults: {
    es: "Sin resultados",
    en: "No results",
    fr: "Aucun résultat",
    it: "Nessun risultato",
    pt: "Sem resultados",
    de: "Keine Ergebnisse",
    ja: "結果がありません",
    zh: "没有结果",
    ko: "결과 없음"
  },
  emptyNotes: {
    es: "Tu cuaderno está vacío.\nToca + para crear tu primer post-it.",
    en: "Your notebook is empty.\nTap + to create your first sticky note.",
    fr: "Ton carnet est vide.\nTouche + pour créer ton premier post-it.",
    it: "Il tuo quaderno è vuoto.\nTocca + per creare il primo post-it.",
    pt: "Seu caderno está vazio.\nToque em + para criar seu primeiro post-it.",
    de: "Dein Notizbuch ist leer.\nTippe auf +, um den ersten Haftzettel zu erstellen.",
    ja: "ノートはまだ空です。\n＋をタップして最初の付箋を作りましょう。",
    zh: "你的笔记本还是空的。\n点 + 创建第一张便签。",
    ko: "노트가 비어 있어요.\n+를 눌러 첫 메모를 만들어 보세요."
  },
  saved: {
    es: "Guardado",
    en: "Saved",
    fr: "Enregistré",
    it: "Salvato",
    pt: "Salvo",
    de: "Gespeichert",
    ja: "保存しました",
    zh: "已保存",
    ko: "저장됨"
  },
  error: {
    es: "Algo salió mal",
    en: "Something went wrong",
    fr: "Une erreur est survenue",
    it: "Qualcosa è andato storto",
    pt: "Algo deu errado",
    de: "Etwas ist schiefgelaufen",
    ja: "問題が発生しました",
    zh: "出了点问题",
    ko: "문제가 발생했어요"
  },
  retry: {
    es: "Reintentar",
    en: "Try again",
    fr: "Réessayer",
    it: "Riprova",
    pt: "Tentar novamente",
    de: "Erneut versuchen",
    ja: "再試行",
    zh: "重试",
    ko: "다시 시도"
  },
  language: {
    es: "Idioma",
    en: "Language",
    fr: "Langue",
    it: "Lingua",
    pt: "Idioma",
    de: "Sprache",
    ja: "言語",
    zh: "语言",
    ko: "언어"
  },
  languageHelp: {
    es: "Se aplica a toda la app.",
    en: "Applies to the whole app.",
    fr: "S'applique à toute l'app.",
    it: "Si applica a tutta l'app.",
    pt: "Aplica-se ao app inteiro.",
    de: "Gilt für die ganze App.",
    ja: "アプリ全体に適用されます。",
    zh: "应用于整个应用。",
    ko: "앱 전체에 적용됩니다."
  },
  security: {
    es: "Seguridad",
    en: "Security",
    fr: "Sécurité",
    it: "Sicurezza",
    pt: "Segurança",
    de: "Sicherheit",
    ja: "セキュリティ",
    zh: "安全",
    ko: "보안"
  },
  changePin: {
    es: "Cambiar PIN",
    en: "Change PIN",
    fr: "Changer le PIN",
    it: "Cambia PIN",
    pt: "Alterar PIN",
    de: "PIN ändern",
    ja: "PINを変更",
    zh: "修改 PIN",
    ko: "PIN 변경"
  },
  lockNow: {
    es: "Bloquear ahora",
    en: "Lock now",
    fr: "Verrouiller maintenant",
    it: "Blocca ora",
    pt: "Bloquear agora",
    de: "Jetzt sperren",
    ja: "今すぐロック",
    zh: "立即锁定",
    ko: "지금 잠그기"
  },
  autoLock: {
    es: "Bloqueo automático",
    en: "Auto-lock",
    fr: "Verrouillage auto",
    it: "Blocco automatico",
    pt: "Bloqueio automático",
    de: "Automatisch sperren",
    ja: "自動ロック",
    zh: "自动锁定",
    ko: "자동 잠금"
  },
  autoLockHelp: {
    es: "Se bloquea al salir de la app.",
    en: "Locks when you leave the app.",
    fr: "Se verrouille en quittant l'app.",
    it: "Si blocca quando esci dall'app.",
    pt: "Bloqueia ao sair do app.",
    de: "Sperrt beim Verlassen der App.",
    ja: "アプリを離れるとロックされます。",
    zh: "离开应用时自动锁定。",
    ko: "앱을 떠나면 잠깁니다."
  },
  min5: {
    es: "5 minutos",
    en: "5 minutes",
    fr: "5 minutes",
    it: "5 minuti",
    pt: "5 minutos",
    de: "5 Minuten",
    ja: "5分",
    zh: "5 分钟",
    ko: "5분"
  },
  min15: {
    es: "15 minutos",
    en: "15 minutes",
    fr: "15 minutes",
    it: "15 minuti",
    pt: "15 minutos",
    de: "15 Minuten",
    ja: "15分",
    zh: "15 分钟",
    ko: "15분"
  },
  min60: {
    es: "1 hora",
    en: "1 hour",
    fr: "1 heure",
    it: "1 ora",
    pt: "1 hora",
    de: "1 Stunde",
    ja: "1時間",
    zh: "1 小时",
    ko: "1시간"
  },
  never: {
    es: "Nunca",
    en: "Never",
    fr: "Jamais",
    it: "Mai",
    pt: "Nunca",
    de: "Nie",
    ja: "なし",
    zh: "从不",
    ko: "사용 안 함"
  },
  pinNotSet: {
    es: "Aún no tienes PIN",
    en: "No PIN yet",
    fr: "Pas encore de PIN",
    it: "Nessun PIN",
    pt: "Ainda sem PIN",
    de: "Noch keine PIN",
    ja: "PINは未設定です",
    zh: "尚未设置 PIN",
    ko: "PIN이 없습니다"
  },
  pinSet: {
    es: "PIN activo",
    en: "PIN active",
    fr: "PIN actif",
    it: "PIN attivo",
    pt: "PIN ativo",
    de: "PIN aktiv",
    ja: "PIN設定済み",
    zh: "PIN 已开启",
    ko: "PIN 사용 중"
  },
  createPin: {
    es: "Crear PIN",
    en: "Create PIN",
    fr: "Créer un PIN",
    it: "Crea PIN",
    pt: "Criar PIN",
    de: "PIN erstellen",
    ja: "PINを作成",
    zh: "创建 PIN",
    ko: "PIN 만들기"
  },
  data: {
    es: "Datos",
    en: "Data",
    fr: "Données",
    it: "Dati",
    pt: "Dados",
    de: "Daten",
    ja: "データ",
    zh: "数据",
    ko: "데이터"
  },
  dataHelp: {
    es: "Se guardan solo en este navegador.",
    en: "Stored only in this browser.",
    fr: "Stockées uniquement dans ce navigateur.",
    it: "Salvati solo in questo browser.",
    pt: "Salvos apenas neste navegador.",
    de: "Nur in diesem Browser gespeichert.",
    ja: "このブラウザにのみ保存されます。",
    zh: "仅保存在此浏览器中。",
    ko: "이 브라우저에만 저장됩니다."
  },
  exportData: {
    es: "Exportar copia",
    en: "Export backup",
    fr: "Exporter une copie",
    it: "Esporta copia",
    pt: "Exportar cópia",
    de: "Backup exportieren",
    ja: "バックアップを書き出す",
    zh: "导出备份",
    ko: "백업 내보내기"
  },
  importData: {
    es: "Importar copia",
    en: "Import backup",
    fr: "Importer une copie",
    it: "Importa copia",
    pt: "Importar cópia",
    de: "Backup importieren",
    ja: "バックアップを読み込む",
    zh: "导入备份",
    ko: "백업 가져오기"
  },
  exportIncludePrivate: {
    es: "Incluir notas privadas y contraseñas (cifradas)",
    en: "Include private notes and passwords (encrypted)",
    fr: "Inclure notes privées et mots de passe (chiffrés)",
    it: "Includi note private e password (cifrate)",
    pt: "Incluir notas privadas e senhas (criptografadas)",
    de: "Private Notizen und Passwörter einschließen (verschlüsselt)",
    ja: "プライベートノートとパスワードを含める（暗号化）",
    zh: "包含私密笔记和密码（已加密）",
    ko: "비공개 노트와 비밀번호 포함 (암호화됨)"
  },
  exportDone: {
    es: "Copia exportada",
    en: "Backup exported",
    fr: "Copie exportée",
    it: "Copia esportata",
    pt: "Cópia exportada",
    de: "Backup exportiert",
    ja: "バックアップを書き出しました",
    zh: "备份已导出",
    ko: "백업을 내보냈어요"
  },
  importDone: {
    es: "Copia importada",
    en: "Backup imported",
    fr: "Copie importée",
    it: "Copia importata",
    pt: "Cópia importada",
    de: "Backup importiert",
    ja: "バックアップを読み込みました",
    zh: "备份已导入",
    ko: "백업을 가져왔어요"
  },
  importError: {
    es: "No pude leer ese archivo",
    en: "I couldn't read that file",
    fr: "Je n'ai pas pu lire ce fichier",
    it: "Non ho potuto leggere il file",
    pt: "Não consegui ler esse arquivo",
    de: "Die Datei konnte nicht gelesen werden",
    ja: "ファイルを読み込めませんでした",
    zh: "无法读取该文件",
    ko: "파일을 읽을 수 없어요"
  },
  importConfirm: {
    es: "Importar reemplaza todos los datos de este dispositivo. ¿Continuar?",
    en: "Importing replaces all data on this device. Continue?",
    fr: "L'importation remplace toutes les données de cet appareil. Continuer ?",
    it: "L'importazione sostituisce tutti i dati del dispositivo. Continuare?",
    pt: "A importação substitui todos os dados deste dispositivo. Continuar?",
    de: "Beim Import werden alle Daten auf diesem Gerät ersetzt. Fortfahren?",
    ja: "読み込むと、この端末のすべてのデータが置き換わります。続けますか？",
    zh: "导入将替换此设备上的所有数据。继续吗？",
    ko: "가져오면 이 기기의 모든 데이터가 교체됩니다. 계속할까요?"
  },
  deleteAll: {
    es: "Borrar todos los datos",
    en: "Delete all data",
    fr: "Supprimer toutes les données",
    it: "Elimina tutti i dati",
    pt: "Apagar todos os dados",
    de: "Alle Daten löschen",
    ja: "すべてのデータを削除",
    zh: "删除所有数据",
    ko: "모든 데이터 삭제"
  },
  deleteAllText: {
    es: "Se borran notas, tareas, cuadernos y contraseñas de este dispositivo. No se puede deshacer.",
    en: "Notes, tasks, notebooks and passwords on this device will be deleted. This can't be undone.",
    fr: "Les notes, tâches, carnets et mots de passe de cet appareil seront supprimés. Action irréversible.",
    it: "Note, attività, quaderni e password di questo dispositivo verranno eliminati. Azione irreversibile.",
    pt: "Notas, tarefas, cadernos e senhas deste dispositivo serão apagados. Não dá para desfazer.",
    de: "Notizen, Aufgaben, Notizbücher und Passwörter auf diesem Gerät werden gelöscht. Nicht rückgängig zu machen.",
    ja: "この端末のノート、タスク、ノートブック、パスワードが削除されます。元に戻せません。",
    zh: "将删除此设备上的笔记、任务、笔记本和密码。无法撤销。",
    ko: "이 기기의 노트, 할 일, 노트북, 비밀번호가 삭제됩니다. 되돌릴 수 없어요."
  },
  deleteAllDone: {
    es: "Datos borrados",
    en: "Data deleted",
    fr: "Données supprimées",
    it: "Dati eliminati",
    pt: "Dados apagados",
    de: "Daten gelöscht",
    ja: "データを削除しました",
    zh: "数据已删除",
    ko: "데이터를 삭제했어요"
  },
  storage: {
    es: "Almacenamiento",
    en: "Storage",
    fr: "Stockage",
    it: "Archiviazione",
    pt: "Armazenamento",
    de: "Speicher",
    ja: "ストレージ",
    zh: "存储",
    ko: "저장 공간"
  },
  used: {
    es: "Usado",
    en: "Used",
    fr: "Utilisé",
    it: "Usato",
    pt: "Usado",
    de: "Belegt",
    ja: "使用中",
    zh: "已使用",
    ko: "사용 중"
  },
  about: {
    es: "Acerca de",
    en: "About",
    fr: "À propos",
    it: "Informazioni",
    pt: "Sobre",
    de: "Über",
    ja: "このアプリについて",
    zh: "关于",
    ko: "정보"
  },
  version: {
    es: "Versión 1.0.0",
    en: "Version 1.0.0",
    fr: "Version 1.0.0",
    it: "Versione 1.0.0",
    pt: "Versão 1.0.0",
    de: "Version 1.0.0",
    ja: "バージョン 1.0.0",
    zh: "版本 1.0.0",
    ko: "버전 1.0.0"
  },
  madeBy: {
    es: "Hecho por Alquimia Lab",
    en: "Made by Alquimia Lab",
    fr: "Fait par Alquimia Lab",
    it: "Fatto da Alquimia Lab",
    pt: "Feito por Alquimia Lab",
    de: "Von Alquimia Lab",
    ja: "Alquimia Lab 制作",
    zh: "由 Alquimia Lab 制作",
    ko: "Alquimia Lab 제작"
  },
  privacy: {
    es: "Privacidad",
    en: "Privacy",
    fr: "Confidentialité",
    it: "Privacy",
    pt: "Privacidade",
    de: "Datenschutz",
    ja: "プライバシー",
    zh: "隐私",
    ko: "개인정보"
  },
  privacyText: {
    es: "Stickly funciona sin cuenta y sin conexión. Todo lo que escribes se queda en este dispositivo: no se envía a ningún servidor, no hay analytics ni publicidad. Las contraseñas y notas privadas se cifran con AES-256 usando un PIN que nunca se guarda. Si borras los datos del navegador o desinstalas la app sin una copia de seguridad, esa información no se puede recuperar.",
    en: "Stickly works without an account and without a connection. Everything you write stays on this device: nothing is sent to a server, and there are no analytics or ads. Passwords and private notes are encrypted with AES-256 using a PIN that is never stored. If you clear your browser data or uninstall the app without a backup, that information cannot be recovered.",
    fr: "Stickly fonctionne sans compte et sans connexion. Tout ce que tu écris reste sur cet appareil : rien n'est envoyé à un serveur, sans analytics ni publicité. Les mots de passe et notes privées sont chiffrés en AES-256 avec un PIN jamais stocké. Si tu effaces les données du navigateur ou désinstalles l'app sans sauvegarde, ces informations sont irrécupérables.",
    it: "Stickly funziona senza account e senza connessione. Tutto ciò che scrivi resta su questo dispositivo: nulla viene inviato a un server, senza analytics né pubblicità. Password e note private sono cifrate con AES-256 usando un PIN che non viene mai salvato. Se cancelli i dati del browser o disinstalli l'app senza un backup, quelle informazioni non si possono recuperare.",
    pt: "O Stickly funciona sem conta e sem conexão. Tudo o que você escreve fica neste dispositivo: nada é enviado a um servidor, sem analytics nem anúncios. Senhas e notas privadas são criptografadas com AES-256 usando um PIN que nunca é salvo. Se você apagar os dados do navegador ou desinstalar o app sem um backup, essas informações não podem ser recuperadas.",
    de: "Stickly funktioniert ohne Konto und ohne Verbindung. Alles, was du schreibst, bleibt auf diesem Gerät: Nichts wird an einen Server gesendet, ohne Analytics oder Werbung. Passwörter und private Notizen werden mit AES-256 und einer PIN verschlüsselt, die nie gespeichert wird. Wenn du Browserdaten löschst oder die App ohne Backup deinstallierst, sind diese Informationen nicht wiederherstellbar.",
    ja: "Sticklyはアカウントも接続も不要です。書いた内容はすべてこの端末に残り、サーバーには送信されません。解析や広告もありません。パスワードとプライベートノートは、保存されないPINを使ってAES-256で暗号化されます。バックアップなしでブラウザのデータを消去したりアプリを削除すると、その情報は復元できません。",
    zh: "Stickly 无需账号，也无需联网。你写下的所有内容都留在这台设备上：不会发送到服务器，也没有分析和广告。密码与私密笔记使用 AES-256 加密，PIN 从不保存。如果清除浏览器数据或卸载应用且没有备份，这些信息将无法恢复。",
    ko: "Stickly는 계정과 연결 없이 작동합니다. 작성한 모든 내용은 이 기기에 남고 서버로 전송되지 않으며, 분석이나 광고도 없습니다. 비밀번호와 비공개 노트는 저장되지 않는 PIN으로 AES-256 암호화됩니다. 백업 없이 브라우저 데이터를 지우거나 앱을 삭제하면 해당 정보는 복구할 수 없습니다."
  },
  terms: {
    es: "Términos",
    en: "Terms",
    fr: "Conditions",
    it: "Termini",
    pt: "Termos",
    de: "Bedingungen",
    ja: "利用規約",
    zh: "条款",
    ko: "약관"
  },
  termsText: {
    es: "Stickly es una herramienta de organización personal. Úsala bajo tu responsabilidad y mantén siempre una copia de seguridad de lo importante. Al comprarla tienes una licencia personal para usarla en tus dispositivos.",
    en: "Stickly is a personal organization tool. Use it at your own responsibility and always keep a backup of what matters. Your purchase includes a personal license to use it on your devices.",
    fr: "Stickly est un outil d'organisation personnelle. Utilise-le sous ta responsabilité et garde toujours une sauvegarde de ce qui compte. L'achat inclut une licence personnelle pour tes appareils.",
    it: "Stickly è uno strumento di organizzazione personale. Usalo sotto la tua responsabilità e tieni sempre un backup di ciò che conta. L'acquisto include una licenza personale per i tuoi dispositivi.",
    pt: "O Stickly é uma ferramenta de organização pessoal. Use com responsabilidade e mantenha sempre um backup do que importa. A compra inclui uma licença pessoal para seus dispositivos.",
    de: "Stickly ist ein Werkzeug zur persönlichen Organisation. Nutze es in eigener Verantwortung und halte immer ein Backup des Wichtigen bereit. Der Kauf umfasst eine persönliche Lizenz für deine Geräte.",
    ja: "Sticklyは個人の整理ツールです。自己の責任で使用し、大切な内容は必ずバックアップしてください。購入にはご自身の端末で使える個人ライセンスが含まれます。",
    zh: "Stickly 是个人整理工具。请自行承担使用责任，并始终备份重要内容。购买后获得在你的设备上使用的个人许可。",
    ko: "Stickly는 개인 정리 도구입니다. 본인 책임하에 사용하고 중요한 내용은 항상 백업하세요. 구매 시 본인 기기에서 사용할 수 있는 개인 라이선스가 포함됩니다."
  },
  install: {
    es: "Instalar Stickly",
    en: "Install Stickly",
    fr: "Installer Stickly",
    it: "Installa Stickly",
    pt: "Instalar Stickly",
    de: "Stickly installieren",
    ja: "Sticklyをインストール",
    zh: "安装 Stickly",
    ko: "Stickly 설치"
  },
  installed: {
    es: "Ya está instalada",
    en: "Already installed",
    fr: "Déjà installée",
    it: "Già installata",
    pt: "Já instalado",
    de: "Bereits installiert",
    ja: "インストール済み",
    zh: "已安装",
    ko: "설치됨"
  },
  installHint: {
    es: "En iPhone/iPad: Compartir → Añadir a pantalla de inicio.",
    en: "On iPhone/iPad: Share → Add to Home Screen.",
    fr: "Sur iPhone/iPad : Partager → Sur l'écran d'accueil.",
    it: "Su iPhone/iPad: Condividi → Aggiungi alla schermata Home.",
    pt: "No iPhone/iPad: Compartilhar → Adicionar à Tela de Início.",
    de: "Auf iPhone/iPad: Teilen → Zum Home-Bildschirm.",
    ja: "iPhone/iPad: 共有 → ホーム画面に追加。",
    zh: "在 iPhone/iPad 上：分享 → 添加到主屏幕。",
    ko: "iPhone/iPad: 공유 → 홈 화면에 추가."
  },
  offline: {
    es: "Sin conexión",
    en: "Offline",
    fr: "Hors ligne",
    it: "Offline",
    pt: "Offline",
    de: "Offline",
    ja: "オフライン",
    zh: "离线",
    ko: "오프라인"
  },
  offlineReady: {
    es: "Funciona sin conexión",
    en: "Works offline",
    fr: "Fonctionne hors ligne",
    it: "Funziona offline",
    pt: "Funciona offline",
    de: "Funktioniert offline",
    ja: "オフラインで使えます",
    zh: "离线可用",
    ko: "오프라인에서 사용 가능"
  },
  updateReady: {
    es: "Hay una versión nueva",
    en: "A new version is available",
    fr: "Une nouvelle version est disponible",
    it: "È disponibile una nuova versione",
    pt: "Há uma nova versão",
    de: "Eine neue Version ist verfügbar",
    ja: "新しいバージョンがあります",
    zh: "有新版本可用",
    ko: "새 버전이 있어요"
  },
  update: {
    es: "Actualizar",
    en: "Update",
    fr: "Mettre à jour",
    it: "Aggiorna",
    pt: "Atualizar",
    de: "Aktualisieren",
    ja: "更新",
    zh: "更新",
    ko: "업데이트"
  },
  storagePersist: {
    es: "Evitar que el navegador borre los datos",
    en: "Prevent the browser from clearing data",
    fr: "Empêcher le navigateur d'effacer les données",
    it: "Impedisci al browser di cancellare i dati",
    pt: "Impedir que o navegador apague os dados",
    de: "Verhindern, dass der Browser Daten löscht",
    ja: "ブラウザによるデータ削除を防ぐ",
    zh: "防止浏览器清除数据",
    ko: "브라우저가 데이터를 지우지 않게 하기"
  },
  storagePersistOk: {
    es: "Listo, tus datos están protegidos",
    en: "Done, your data is protected",
    fr: "C'est fait, tes données sont protégées",
    it: "Fatto, i tuoi dati sono protetti",
    pt: "Pronto, seus dados estão protegidos",
    de: "Fertig, deine Daten sind geschützt",
    ja: "完了。データは保護されました",
    zh: "完成，你的数据已受保护",
    ko: "완료되었어요. 데이터가 보호됩니다"
  },
  storagePersistNo: {
    es: "El navegador no lo permite ahora",
    en: "The browser won't allow it right now",
    fr: "Le navigateur ne le permet pas pour le moment",
    it: "Il browser non lo consente ora",
    pt: "O navegador não permite agora",
    de: "Der Browser erlaubt es gerade nicht",
    ja: "現在は許可されていません",
    zh: "浏览器现在不允许",
    ko: "지금은 브라우저가 허용하지 않아요"
  },
  pin6: {
    es: "Crea un PIN de 6 dígitos",
    en: "Create a 6-digit PIN",
    fr: "Crée un PIN à 6 chiffres",
    it: "Crea un PIN di 6 cifre",
    pt: "Crie um PIN de 6 dígitos",
    de: "Erstelle eine 6-stellige PIN",
    ja: "6桁のPINを作成",
    zh: "创建 6 位 PIN",
    ko: "6자리 PIN 만들기"
  },
  pin6confirm: {
    es: "Repite tu PIN",
    en: "Repeat your PIN",
    fr: "Répète ton PIN",
    it: "Ripeti il PIN",
    pt: "Repita seu PIN",
    de: "PIN wiederholen",
    ja: "PINをもう一度",
    zh: "再次输入 PIN",
    ko: "PIN 다시 입력"
  },
  pin6enter: {
    es: "Escribe tu PIN",
    en: "Enter your PIN",
    fr: "Saisis ton PIN",
    it: "Inserisci il PIN",
    pt: "Digite seu PIN",
    de: "PIN eingeben",
    ja: "PINを入力",
    zh: "输入 PIN",
    ko: "PIN 입력"
  },
  pinWrong: {
    es: "PIN incorrecto",
    en: "Wrong PIN",
    fr: "PIN incorrect",
    it: "PIN errato",
    pt: "PIN incorreto",
    de: "Falsche PIN",
    ja: "PINが違います",
    zh: "PIN 错误",
    ko: "PIN이 틀렸어요"
  },
  pinMismatch: {
    es: "Los PIN no coinciden",
    en: "PINs don't match",
    fr: "Les PIN ne correspondent pas",
    it: "I PIN non coincidono",
    pt: "Os PINs não coincidem",
    de: "PINs stimmen nicht überein",
    ja: "PINが一致しません",
    zh: "PIN 不一致",
    ko: "PIN이 일치하지 않아요"
  },
  pinCreated: {
    es: "PIN creado",
    en: "PIN created",
    fr: "PIN créé",
    it: "PIN creato",
    pt: "PIN criado",
    de: "PIN erstellt",
    ja: "PINを作成しました",
    zh: "PIN 已创建",
    ko: "PIN을 만들었어요"
  },
  pinLocked: {
    es: "Demasiados intentos",
    en: "Too many attempts",
    fr: "Trop de tentatives",
    it: "Troppi tentativi",
    pt: "Muitas tentativas",
    de: "Zu viele Versuche",
    ja: "試行回数が多すぎます",
    zh: "尝试次数过多",
    ko: "시도 횟수가 너무 많아요"
  },
  pinWait: {
    es: "Espera {s} s",
    en: "Wait {s}s",
    fr: "Attends {s} s",
    it: "Attendi {s} s",
    pt: "Aguarde {s} s",
    de: "Warte {s} s",
    ja: "{s}秒お待ちください",
    zh: "请等待 {s} 秒",
    ko: "{s}초 기다려 주세요"
  },
  pinForgot: {
    es: "Olvidé mi PIN",
    en: "I forgot my PIN",
    fr: "J'ai oublié mon PIN",
    it: "Ho dimenticato il PIN",
    pt: "Esqueci meu PIN",
    de: "PIN vergessen",
    ja: "PINを忘れた",
    zh: "忘记 PIN",
    ko: "PIN을 잊었어요"
  },
  pinForgotText: {
    es: "Tu PIN no se guarda: es la llave para descifrar tus datos. Si lo olvidaste, solo puedes restablecer Stickly y empezar de cero.",
    en: "Your PIN isn't stored: it's the key to decrypt your data. If you forgot it, you can only reset Stickly and start over.",
    fr: "Ton PIN n'est pas stocké : c'est la clé qui déchiffre tes données. Si tu l'as oublié, tu ne peux que réinitialiser Stickly et repartir de zéro.",
    it: "Il PIN non viene salvato: è la chiave per decifrare i dati. Se lo hai dimenticato, puoi solo reimpostare Stickly e ricominciare.",
    pt: "Seu PIN não é salvo: é a chave para descriptografar seus dados. Se esqueceu, só pode redefinir o Stickly e começar de novo.",
    de: "Deine PIN wird nicht gespeichert: Sie ist der Schlüssel zu deinen Daten. Wenn du sie vergessen hast, kannst du Stickly nur zurücksetzen und neu beginnen.",
    ja: "PINは保存されません。データを復号する鍵です。忘れた場合はSticklyをリセットして最初からやり直すしかありません。",
    zh: "PIN 不会被保存，它是解密数据的钥匙。如果忘记，只能重置 Stickly 从头开始。",
    ko: "PIN은 저장되지 않으며 데이터를 복호화하는 열쇠입니다. 잊으면 Stickly를 초기화하고 처음부터 시작해야 해요."
  },
  pinReset: {
    es: "Restablecer y borrar datos",
    en: "Reset and delete data",
    fr: "Réinitialiser et effacer",
    it: "Reimposta ed elimina i dati",
    pt: "Redefinir e apagar dados",
    de: "Zurücksetzen und löschen",
    ja: "リセットして削除",
    zh: "重置并删除数据",
    ko: "초기화하고 데이터 삭제"
  },
  pinNeeded: {
    es: "Este contenido está protegido",
    en: "This content is protected",
    fr: "Ce contenu est protégé",
    it: "Questo contenuto è protetto",
    pt: "Este conteúdo está protegido",
    de: "Dieser Inhalt ist geschützt",
    ja: "この内容は保護されています",
    zh: "此内容受保护",
    ko: "보호된 콘텐츠예요"
  },
  pinNeededText: {
    es: "Escribe tu PIN para desbloquear tus contraseñas y notas privadas.",
    en: "Enter your PIN to unlock your passwords and private notes.",
    fr: "Saisis ton PIN pour déverrouiller mots de passe et notes privées.",
    it: "Inserisci il PIN per sbloccare password e note private.",
    pt: "Digite seu PIN para desbloquear senhas e notas privadas.",
    de: "Gib deine PIN ein, um Passwörter und private Notizen zu entsperren.",
    ja: "PINを入力してパスワードとプライベートノートを開きます。",
    zh: "输入 PIN 以解锁密码和私密笔记。",
    ko: "PIN을 입력해 비밀번호와 비공개 노트를 잠금 해제하세요."
  },
  locked: {
    es: "Bloqueado",
    en: "Locked",
    fr: "Verrouillé",
    it: "Bloccato",
    pt: "Bloqueado",
    de: "Gesperrt",
    ja: "ロック中",
    zh: "已锁定",
    ko: "잠김"
  },
  privateHint: {
    es: "Se cifra con tu PIN",
    en: "Encrypted with your PIN",
    fr: "Chiffré avec ton PIN",
    it: "Cifrato con il tuo PIN",
    pt: "Criptografado com seu PIN",
    de: "Mit deiner PIN verschlüsselt",
    ja: "PINで暗号化",
    zh: "使用 PIN 加密",
    ko: "PIN으로 암호화됨"
  },
  copyPassword: {
    es: "Copiar contraseña",
    en: "Copy password",
    fr: "Copier le mot de passe",
    it: "Copia password",
    pt: "Copiar senha",
    de: "Passwort kopieren",
    ja: "パスワードをコピー",
    zh: "复制密码",
    ko: "비밀번호 복사"
  },
  copyUser: {
    es: "Copiar usuario",
    en: "Copy username",
    fr: "Copier l'identifiant",
    it: "Copia utente",
    pt: "Copiar usuário",
    de: "Benutzername kopieren",
    ja: "ユーザー名をコピー",
    zh: "复制用户名",
    ko: "사용자 이름 복사"
  },
  deletePassword: {
    es: "¿Eliminar esta contraseña?",
    en: "Delete this password?",
    fr: "Supprimer ce mot de passe ?",
    it: "Eliminare questa password?",
    pt: "Apagar esta senha?",
    de: "Dieses Passwort löschen?",
    ja: "このパスワードを削除しますか？",
    zh: "删除这个密码？",
    ko: "이 비밀번호를 삭제할까요?"
  },
  deleteNotebook: {
    es: "¿Eliminar este cuaderno?",
    en: "Delete this notebook?",
    fr: "Supprimer ce carnet ?",
    it: "Eliminare questo quaderno?",
    pt: "Apagar este caderno?",
    de: "Dieses Notizbuch löschen?",
    ja: "このノートブックを削除しますか？",
    zh: "删除这个笔记本？",
    ko: "이 노트북을 삭제할까요?"
  },
  deleteNotebookNote: {
    es: "¿Eliminar esta nota?",
    en: "Delete this note?",
    fr: "Supprimer cette note ?",
    it: "Eliminare questa nota?",
    pt: "Apagar esta nota?",
    de: "Diese Notiz löschen?",
    ja: "このノートを削除しますか？",
    zh: "删除这条笔记？",
    ko: "이 노트를 삭제할까요?"
  },
  titlePlaceholder: {
    es: "Sin título",
    en: "Untitled",
    fr: "Sans titre",
    it: "Senza titolo",
    pt: "Sem título",
    de: "Ohne Titel",
    ja: "無題",
    zh: "无标题",
    ko: "제목 없음"
  },
  recordHint: {
    es: "Máximo 10 minutos",
    en: "Up to 10 minutes",
    fr: "10 minutes maximum",
    it: "Massimo 10 minuti",
    pt: "Máximo 10 minutos",
    de: "Maximal 10 Minuten",
    ja: "最大10分",
    zh: "最长 10 分钟",
    ko: "최대 10분"
  },
  cycles: {
    es: "Ciclos completados",
    en: "Completed cycles",
    fr: "Cycles terminés",
    it: "Cicli completati",
    pt: "Ciclos concluídos",
    de: "Abgeschlossene Zyklen",
    ja: "完了したサイクル",
    zh: "已完成轮次",
    ko: "완료한 사이클"
  },
  subjectPlaceholder: {
    es: "Materia o proyecto (opcional)",
    en: "Subject or project (optional)",
    fr: "Matière ou projet (facultatif)",
    it: "Materia o progetto (facoltativo)",
    pt: "Matéria ou projeto (opcional)",
    de: "Fach oder Projekt (optional)",
    ja: "科目やプロジェクト（任意）",
    zh: "科目或项目（可选）",
    ko: "과목 또는 프로젝트 (선택)"
  },
  editName: {
    es: "Editar nombre",
    en: "Edit name",
    fr: "Modifier le nom",
    it: "Modifica nome",
    pt: "Editar nome",
    de: "Namen bearbeiten",
    ja: "名前を編集",
    zh: "编辑名字",
    ko: "이름 수정"
  },
  confirmLeave: {
    es: "¿Salir sin guardar?",
    en: "Leave without saving?",
    fr: "Quitter sans enregistrer ?",
    it: "Uscire senza salvare?",
    pt: "Sair sem salvar?",
    de: "Ohne Speichern verlassen?",
    ja: "保存せずに閉じますか？",
    zh: "不保存就离开？",
    ko: "저장하지 않고 나갈까요?"
  },
  discard: {
    es: "Descartar",
    en: "Discard",
    fr: "Abandonner",
    it: "Scarta",
    pt: "Descartar",
    de: "Verwerfen",
    ja: "破棄",
    zh: "放弃",
    ko: "버리기"
  },
  keepEditing: {
    es: "Seguir editando",
    en: "Keep editing",
    fr: "Continuer l'édition",
    it: "Continua a modificare",
    pt: "Continuar editando",
    de: "Weiter bearbeiten",
    ja: "編集を続ける",
    zh: "继续编辑",
    ko: "계속 편집"
  },
  vaultHelp: {
    es: "Cifrado con AES-256. Tu PIN no se guarda.",
    en: "AES-256 encrypted. Your PIN is never stored.",
    fr: "Chiffré en AES-256. Ton PIN n'est jamais stocké.",
    it: "Cifrato con AES-256. Il PIN non viene salvato.",
    pt: "Criptografado com AES-256. Seu PIN não é salvo.",
    de: "AES-256-verschlüsselt. Deine PIN wird nie gespeichert.",
    ja: "AES-256で暗号化。PINは保存されません。",
    zh: "使用 AES-256 加密，PIN 不会被保存。",
    ko: "AES-256 암호화. PIN은 저장되지 않아요."
  },
  noContent: {
    es: "Aquí no hay nada todavía.",
    en: "Nothing here yet.",
    fr: "Rien ici pour l'instant.",
    it: "Qui non c'è ancora nulla.",
    pt: "Ainda não há nada aqui.",
    de: "Hier ist noch nichts.",
    ja: "まだ何もありません。",
    zh: "这里还什么都没有。",
    ko: "아직 아무것도 없어요."
  },
  all: {
    es: "Todo",
    en: "All",
    fr: "Tout",
    it: "Tutto",
    pt: "Tudo",
    de: "Alle",
    ja: "すべて",
    zh: "全部",
    ko: "전체"
  },
  audioReady: {
    es: "Audio listo",
    en: "Audio ready",
    fr: "Audio prêt",
    it: "Audio pronto",
    pt: "Áudio pronto",
    de: "Audio bereit",
    ja: "音声の準備ができました",
    zh: "音频已就绪",
    ko: "오디오 준비 완료"
  }
};

const DICT = {};
for (const lang of LANGS) {
  DICT[lang] = Object.assign({}, BASE[lang] || BASE.es || {}, {});
  for (const key of Object.keys(EXTRA)) {
    if (EXTRA[key][lang]) DICT[lang][key] = EXTRA[key][lang];
  }
  for (const key of Object.keys(EXTRA_PWA)) {
    if (EXTRA_PWA[key][lang]) DICT[lang][key] = EXTRA_PWA[key][lang];
  }
}

const STORE_KEY = "stickly-lang";
let current = "es";

export function detectLang() {
  let saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* ignore */ }
  if (saved && LANGS.indexOf(saved) !== -1) return saved;
  const nav = (navigator.language || "es").slice(0, 2).toLowerCase();
  return LANGS.indexOf(nav) !== -1 ? nav : "es";
}

export function setLang(lang, persist) {
  current = LANGS.indexOf(lang) !== -1 ? lang : "es";
  document.documentElement.lang = current;
  if (persist !== false) {
    try { localStorage.setItem(STORE_KEY, current); } catch (e) { /* ignore */ }
  }
  return current;
}

export function getLang() {
  return current;
}

export function t(key, vars) {
  let out = DICT[current] && DICT[current][key] != null
    ? DICT[current][key]
    : (DICT.es[key] != null ? DICT.es[key] : key);
  if (vars) {
    out = out.replace(/\{(\w+)\}/g, function (m, name) {
      return vars[name] != null ? vars[name] : m;
    });
  }
  return out;
}

export function langName(code) {
  return LANG_LABELS[code] || code;
}
