export const API_RESPONSE_CODES = {
    0: {
        tr: {
            title: "İnternet bağlantısı yok.",
            description: "Ağ bağlantınızı kontrol edin ve tekrar deneyin.",
        },
        en: {
            title: "No internet connection.",
            description: "Check your network connection and try again.",
        },
        fr: {
            title: "Pas de connexion internet.",
            description: "Vérifiez votre connexion réseau et réessayez.",
        },
        de: {
            title: "Keine Internetverbindung.",
            description: "Überprüfen Sie Ihre Netzwerkverbindung und versuchen Sie es erneut.",
        },
        es: {
            title: "Sin conexión a Internet.",
            description: "Comprueba tu conexión de red y vuelve a intentarlo.",
        },
    },

    200: {
        tr: {
            title: "İşlem başarılı.",
            description: "Talep edilen işlem sorunsuz şekilde tamamlandı.",
        },
        en: {
            title: "Success.",
            description: "The requested operation completed successfully.",
        },
        fr: {
            title: "Succès.",
            description: "L’opération demandée s’est terminée avec succès.",
        },
        de: {
            title: "Erfolgreich.",
            description: "Der angeforderte Vorgang wurde erfolgreich abgeschlossen.",
        },
        es: {
            title: "Éxito.",
            description: "La operación solicitada se completó correctamente.",
        },
    },

    201: {
        tr: {
            title: "Kaynak oluşturuldu.",
            description: "Yeni içerik başarıyla oluşturuldu.",
        },
        en: {
            title: "Resource created.",
            description: "The new resource was created successfully.",
        },
        fr: {
            title: "Ressource créée.",
            description: "La nouvelle ressource a été créée avec succès.",
        },
        de: {
            title: "Ressource erstellt.",
            description: "Die neue Ressource wurde erfolgreich erstellt.",
        },
        es: {
            title: "Recurso creado.",
            description: "El nuevo recurso se creó correctamente.",
        },
    },

    204: {
        tr: {
            title: "İşlem tamamlandı.",
            description: "İşlem başarılı ancak gösterilecek bir içerik yok.",
        },
        en: {
            title: "No content.",
            description: "The operation succeeded but there is no content to display.",
        },
        fr: {
            title: "Aucun contenu.",
            description: "L’opération a réussi mais aucun contenu n’est disponible.",
        },
        de: {
            title: "Kein Inhalt.",
            description: "Der Vorgang war erfolgreich, es gibt jedoch keinen Inhalt.",
        },
        es: {
            title: "Sin contenido.",
            description: "La operación fue exitosa pero no hay contenido para mostrar.",
        },
    },

    301: {
        tr: {
            title: "Kaynak taşındı.",
            description: "Bu içerik kalıcı olarak başka bir adrese taşındı.",
        },
        en: {
            title: "Resource moved permanently.",
            description: "This content has been permanently moved to another location.",
        },
        fr: {
            title: "Ressource déplacée.",
            description: "Ce contenu a été déplacé définitivement.",
        },
        de: {
            title: "Ressource verschoben.",
            description: "Diese Ressource wurde dauerhaft verschoben.",
        },
        es: {
            title: "Recurso movido.",
            description: "Este contenido se ha movido de forma permanente.",
        },
    },

    302: {
        tr: {
            title: "Geçici yönlendirme.",
            description: "Bu içerik geçici olarak başka bir adresten sunuluyor.",
        },
        en: {
            title: "Temporary redirect.",
            description: "This content is temporarily served from another location.",
        },
        fr: {
            title: "Redirection temporaire.",
            description: "Ce contenu est temporairement accessible ailleurs.",
        },
        de: {
            title: "Temporäre Weiterleitung.",
            description: "Dieser Inhalt wird vorübergehend von einem anderen Ort bereitgestellt.",
        },
        es: {
            title: "Redirección temporal.",
            description: "Este contenido se muestra temporalmente desde otra ubicación.",
        },
    },

    400: {
        tr: {
            title: "Geçersiz istek.",
            description: "Gönderilen veriler hatalı veya eksik olabilir.",
        },
        en: {
            title: "Bad request.",
            description: "The request data may be invalid or incomplete.",
        },
        fr: {
            title: "Requête incorrecte.",
            description: "Les données envoyées peuvent être invalides ou incomplètes.",
        },
        de: {
            title: "Ungültige Anfrage.",
            description: "Die gesendeten Daten sind möglicherweise ungültig oder unvollständig.",
        },
        es: {
            title: "Solicitud incorrecta.",
            description: "Los datos enviados pueden ser inválidos o incompletos.",
        },
    },

    401: {
        tr: {
            title: "Giriş gerekli.",
            description: "Bu işlemi yapmak için oturum açmanız gerekiyor.",
        },
        en: {
            title: "Authentication required.",
            description: "You need to be logged in to perform this action.",
        },
        fr: {
            title: "Authentification requise.",
            description: "Vous devez être connecté pour effectuer cette action.",
        },
        de: {
            title: "Anmeldung erforderlich.",
            description: "Sie müssen angemeldet sein, um diese Aktion auszuführen.",
        },
        es: {
            title: "Autenticación requerida.",
            description: "Debes iniciar sesión para realizar esta acción.",
        },
    },

    403: {
        tr: {
            title: "Erişim reddedildi.",
            description: "Bu içeriğe erişim yetkiniz bulunmuyor.",
        },
        en: {
            title: "Access denied.",
            description: "You do not have permission to access this content.",
        },
        fr: {
            title: "Accès refusé.",
            description: "Vous n’avez pas l’autorisation d’accéder à ce contenu.",
        },
        de: {
            title: "Zugriff verweigert.",
            description: "Sie haben keine Berechtigung für diesen Zugriff.",
        },
        es: {
            title: "Acceso denegado.",
            description: "No tienes permiso para acceder a este contenido.",
        },
    },

    404: {
        tr: {
            title: "Sayfa bulunamadı.",
            description: "Adres yanlış olabilir veya içerik kaldırılmış olabilir.",
        },
        en: {
            title: "Page not found.",
            description: "The page may have been removed or the URL is incorrect.",
        },
        fr: {
            title: "Page introuvable.",
            description: "La page a peut-être été supprimée ou l’URL est incorrecte.",
        },
        de: {
            title: "Seite nicht gefunden.",
            description: "Die Seite wurde möglicherweise entfernt oder die URL ist falsch.",
        },
        es: {
            title: "Página no encontrada.",
            description: "La página puede haber sido eliminada o la URL es incorrecta.",
        },
    },

    429: {
        tr: {
            title: "Çok fazla istek.",
            description: "Lütfen biraz bekleyip tekrar deneyin.",
        },
        en: {
            title: "Too many requests.",
            description: "Please wait a moment and try again.",
        },
        fr: {
            title: "Trop de requêtes.",
            description: "Veuillez patienter un moment avant de réessayer.",
        },
        de: {
            title: "Zu viele Anfragen.",
            description: "Bitte warten Sie kurz und versuchen Sie es erneut.",
        },
        es: {
            title: "Demasiadas solicitudes.",
            description: "Espera un momento y vuelve a intentarlo.",
        },
    },

    500: {
        tr: {
            title: "Sunucu hatası.",
            description: "Beklenmeyen bir hata oluştu, daha sonra tekrar deneyin.",
        },
        en: {
            title: "Server error.",
            description: "An unexpected error occurred, please try again later.",
        },
        fr: {
            title: "Erreur serveur.",
            description: "Une erreur inattendue s’est produite, veuillez réessayer plus tard.",
        },
        de: {
            title: "Serverfehler.",
            description: "Ein unerwarteter Fehler ist aufgetreten, bitte später erneut versuchen.",
        },
        es: {
            title: "Error del servidor.",
            description: "Ocurrió un error inesperado, inténtalo de nuevo más tarde.",
        },
    },

    unknown: {
        tr: {
            title: "Bilinmeyen hata.",
            description: "Beklenmeyen bir durum oluştu.",
        },
        en: {
            title: "Unknown error.",
            description: "An unexpected situation occurred.",
        },
        fr: {
            title: "Erreur inconnue.",
            description: "Une situation inattendue s’est produite.",
        },
        de: {
            title: "Unbekannter Fehler.",
            description: "Eine unerwartete Situation ist aufgetreten.",
        },
        es: {
            title: "Error desconocido.",
            description: "Ocurrió una situación inesperada.",
        },
    },
};
