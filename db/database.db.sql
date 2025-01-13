BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "cinemas" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"description"	TEXT,
	"address"	TEXT,
	"photo"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "menu_items" (
	"id"	INTEGER,
	"restaurant_id"	INTEGER,
	"name"	TEXT NOT NULL,
	"price"	INTEGER NOT NULL,
	"description"	TEXT,
	"foto"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("restaurant_id") REFERENCES "restaurants"("id")
);
CREATE TABLE IF NOT EXISTS "movies" (
	"id"	INTEGER,
	"cinema_id"	INTEGER,
	"title"	TEXT NOT NULL,
	"genre"	TEXT,
	"release_date"	TEXT,
	"description"	TEXT,
	"rating"	REAL,
	"poster"	TEXT,
	"price"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("cinema_id") REFERENCES "cinemas"("id")
);
CREATE TABLE IF NOT EXISTS "orders" (
	"id"	INTEGER,
	"total_price"	NUMERIC NOT NULL,
	"created_at"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"delivery_time"	BLOB,
	"address"	TEXT,
	"phone"	TEXT,
	"items"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "restaurants" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"description"	TEXT,
	"foto"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "showtimes" (
	"id"	INTEGER,
	"movie_id"	INTEGER,
	"cinema_id"	INTEGER,
	"showtime"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("cinema_id") REFERENCES "cinemas"("id"),
	FOREIGN KEY("movie_id") REFERENCES "movies"("id")
);
CREATE TABLE IF NOT EXISTS "tickets" (
	"id"	INTEGER,
	"movie_id"	INTEGER,
	"cinema_id"	INTEGER,
	"showtime"	TEXT NOT NULL,
	"price"	NUMERIC NOT NULL,
	"seat_number"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("cinema_id") REFERENCES "cinemas"("id"),
	FOREIGN KEY("movie_id") REFERENCES "movies"("id")
);
CREATE TABLE IF NOT EXISTS "user" (
	"id"	INTEGER,
	"username"	TEXT UNIQUE,
	"password"	TEXT UNIQUE,
	PRIMARY KEY("id")
);
INSERT INTO "cinemas" VALUES (1,'Cinema City','Большой кинотеатр с множеством экранов и современным оборудованием.','ул. Кино, 1','CinemaCity.png');
INSERT INTO "cinemas" VALUES (2,'Movie Palace','Уютный кинотеатр с комфортными креслами и отличным обслуживанием.','пр. Фильм, 12','MoviePalace.png');
INSERT INTO "cinemas" VALUES (3,'MegaMovie','Современный кинотеатр с 3D и IMAX технологиями.','ул. Экран, 5','MegaMovie.png');
INSERT INTO "cinemas" VALUES (4,'ArtHouse','Кинотеатр, специализирующийся на независимых фильмах и арт-хаусном кино.','пер. Искусств, 3','ArtHouse.png');
INSERT INTO "menu_items" VALUES (1,3,'Бургер ',250,'говяжья котлета, помидоры, салат, соус, сыр -260 гр.','vopper.png');
INSERT INTO "menu_items" VALUES (2,3,'Чикен Бругер',100,'куринная котлета, сыром - 200 гр.','chikenburger.jpg
');
INSERT INTO "menu_items" VALUES (9,3,'Пепперони',400,'Американская классика с пикантной пепперони, Моцареллой и фирменным томатным соусом - 500 г.','peperonni.png');
INSERT INTO "menu_items" VALUES (10,1,'Соленый поп-корн',100,'150 гр.','соленыйпопкорн.png');
INSERT INTO "menu_items" VALUES (11,3,'Сырная пицца',380,'сыр моцарелла, сыр сливочный, соус - 400 гр.','сырная.png');
INSERT INTO "menu_items" VALUES (12,3,'Гавайская пицца',400,'Тропическая классика с ароматной ветчиной, фирменным томатным соусом и Моцареллой в сочетании с кусочками ананаса - 450 г.','гавайская.png');
INSERT INTO "menu_items" VALUES (13,3,'Маргарита',400,'Традиционный рецепт пиццы с Моцареллой, сочными томатами, фирменным томатным соусом и орегано- 450 г.','маргарита.png');
INSERT INTO "menu_items" VALUES (14,1,'Карамельный поп-корн',120,'150 гр.','карамельный попкорн.png
');
INSERT INTO "menu_items" VALUES (15,3,'Мороженное',80,'Шоколадное мороженное - 80г.','ice.png
');
INSERT INTO "menu_items" VALUES (16,2,'Кока-кола',90,'350 мл.','cola.png
');
INSERT INTO "menu_items" VALUES (17,3,'Двойной Чизбургер',160,'Две котлеты, салат, помидор, сыр, лук - 160г.','2chizburger.png');
INSERT INTO "menu_items" VALUES (19,1,'Чипсы Лэйс с луком',80,'80 гр.','чипсы луковые.png

');
INSERT INTO "menu_items" VALUES (20,2,'Шоколадный молочный коктейль ',95,'Молоко, мороженное, шоколад, сливки','icechoco.png');
INSERT INTO "menu_items" VALUES (21,1,'Сырный поп-корн',110,'150 гр.','cырный попкорн.png
');
INSERT INTO "menu_items" VALUES (22,1,'Чипсы pringles крабовые',220,'165 гр.','prкраб.png
');
INSERT INTO "menu_items" VALUES (26,1,'Чипсы pringles оригинальные',210,'165 гр.','pr.jpg');
INSERT INTO "menu_items" VALUES (27,1,'Чипсы Лэйс с беконом',90,'80 гр.','чипсы с беконом.png');
INSERT INTO "menu_items" VALUES (28,1,'Чипсы Лэйс сырный',80,'80 гр.','сырные чипсы.png');
INSERT INTO "menu_items" VALUES (29,1,'Чипсы pringles сырные',210,'165 гр.','prсырная.png');
INSERT INTO "menu_items" VALUES (30,1,'M&M’s шоколадынй',150,'145 гр.','mm1.png');
INSERT INTO "menu_items" VALUES (31,1,'M&M’s арахисовый',155,'145 гр.','mm2.png');
INSERT INTO "menu_items" VALUES (32,1,'M&M’s шоколадынй(маленький)',70,'45 гр.','mm1-1.png');
INSERT INTO "menu_items" VALUES (33,1,'M&M’s арахисовый (маленький)',70,'45 гр.','mm2-2.png');
INSERT INTO "menu_items" VALUES (34,1,'Cheetos Чипсы',70,'55 гр.','cheet.png');
INSERT INTO "menu_items" VALUES (35,1,'Cheetos Чипсы сырный',70,'55 гр.','cheet2.png');
INSERT INTO "menu_items" VALUES (37,2,'Молочный коктейль',95,'Молоко, мороженное','milk.png');
INSERT INTO "menu_items" VALUES (38,2,'Клубничный молочный коктейль',95,'Молоко, мороженное, клубника','milk2.png');
INSERT INTO "menu_items" VALUES (39,2,'Смузи яблочный',180,'450 гр.','смузияблочный.png');
INSERT INTO "menu_items" VALUES (40,2,'Смузи ягодный',180,'450 гр.','смузиягодный.png');
INSERT INTO "menu_items" VALUES (41,2,'Смузи клубничный',180,'450 гр.','смузиклубничный.png');
INSERT INTO "menu_items" VALUES (42,2,'Смузи банановый',180,'450 гр.','смузибанановый.png');
INSERT INTO "movies" VALUES (0,1,'Титаник','Драма','1997-12-19','Эпическая история любви на фоне трагедии.',7.8,'titanic.jpg',500);
INSERT INTO "movies" VALUES (4,1,'Звёздные войны','Фантастика','1977-05-25','Сага о межгалактической борьбе.',8.6,'Starwars.jpg',500);
INSERT INTO "movies" VALUES (5,2,'Назад в будущее','Приключения','1985-07-03','Молодой человек попадает в прошлое.',8.5,'backtothefuture.jpg',500);
INSERT INTO "movies" VALUES (6,2,'Темный рыцарь','Экшн','2008-07-18','Борьба преступного мира Готэма с Бэтменом.',9.0,'Batman.jpg',500);
INSERT INTO "movies" VALUES (7,1,'Властелин колец: Братство кольца','Фэнтези','2001-12-19','Приключение в мире Средиземья.',8.8,'TheLordoftheRings.jpg',500);
INSERT INTO "movies" VALUES (8,3,'Пираты Карибского моря: Проклятие Черной жемчужины','Приключения','2003-07-09','Приключения капитана Джека Воробья.',8.0,'pirates.jpg',500);
INSERT INTO "movies" VALUES (9,2,'Интерстеллар','Фантастика','2014-11-07','Космическое путешествие через червоточину.',8.6,'Interstellar.jpg',500);
INSERT INTO "movies" VALUES (10,1,'Аватар','Фантастика','2009-12-18','Приключение на планете Пандора.',7.8,'Avatar.jpg',500);
INSERT INTO "movies" VALUES (11,3,'Начало','Научная фантастика','2010-07-16','Кража идей через сны.',8.8,'Inception.jpg',500);
INSERT INTO "movies" VALUES (12,1,'Форрест Гамп','Драма','1994-07-06','История жизни человека с низким IQ.',8.8,'Forrestgump.jpg',500);
INSERT INTO "movies" VALUES (13,3,'Мстители: Война бесконечности','Экшн','2018-04-27','Супергерои против Таноса.',8.4,'Avengers.jpg',500);
INSERT INTO "movies" VALUES (14,4,'На грани','Драма','2022-05-10','Фильм о том, как преодолеть жизненные трудности.',8.5,'theedge.jpg',500);
INSERT INTO "movies" VALUES (15,4,'Тишина','Триллер','2022-06-15','Картину о том, как можно прожить в тишине и уединении.',7.3,'hush.jpg',500);
INSERT INTO "movies" VALUES (16,4,'Актриса тысячилетия','Драма','2001-09-14','История любви, выраженной через искусство.',9.1,'MillenniumActress.jpg',500);
INSERT INTO "movies" VALUES (17,4,'Паприка','Фантастика','2007-06-14','Японский анимационный фильм в жанре научной фантастики и психологического триллера.',8.0,'paprika.jpg',500);
INSERT INTO "orders" VALUES (1,250,'2024-10-15 16:15:29','211212-12-21T21:12','ул. Лермонтова, 15','89526282721','[["Кока-кола",1,90],["Двойной Чизбургер",1,160]]',1);
INSERT INTO "orders" VALUES (2,550,'2024-10-15 16:18:54','211212-12-12T12:21','ул. Лермонтова, 15','89526282721','[["Калифорния",1,300],["Сяке маки",1,250]]',1);
INSERT INTO "orders" VALUES (3,600,'2024-10-17 14:59:25','2024-02-11T12:12','ул. Лермонтова, 15','89526282721','[["Роллы Филадельфия",1,300],["Калифорния",1,300]]',1);
INSERT INTO "orders" VALUES (4,250,'2024-10-24 03:46:12','121212-12-12T12:12','ул. Лермонтова, 15','89526282721','[["Кока-кола",1,90],["Двойной Чизбургер",1,160]]',1);
INSERT INTO "orders" VALUES (5,360,'2024-12-05 04:29:06','121221-12-12T12:12','имит','89526282721','[["Карамельный поп-корн",1,120],["Чипсы Лэйс с луком",1,80],["Двойной Чизбургер",1,160]]',1);
INSERT INTO "restaurants" VALUES (1,'Снеки','Попкорны, чипсы, закуски','snacks.png
');
INSERT INTO "restaurants" VALUES (2,'Напитки','Молочные коктейли, газированные напитки, смузи','напитки.png
');
INSERT INTO "restaurants" VALUES (3,'Фаст-фуд','Сэндвичи, бургеры, пицца','food.png
');
INSERT INTO "showtimes" VALUES (1,1,1,'2024-11-12 14:30');
INSERT INTO "showtimes" VALUES (2,1,1,'2024-11-12 18:00');
INSERT INTO "showtimes" VALUES (3,2,1,'2024-11-12 20:00');
INSERT INTO "showtimes" VALUES (4,3,2,'2024-11-13 15:00');
INSERT INTO "showtimes" VALUES (5,2,2,'2024-11-13 19:00');
INSERT INTO "tickets" VALUES (1,1,1,'2024-11-11 19:00:00',10.5,'A1',1);
INSERT INTO "tickets" VALUES (2,2,1,'2024-11-11 21:00:00',12,'A2',2);
INSERT INTO "tickets" VALUES (3,1,2,'2024-11-12 18:00:00',10,'B1',1);
INSERT INTO "tickets" VALUES (4,3,2,'2024-11-12 20:00:00',15,'B2',3);
INSERT INTO "user" VALUES (1,'89526282721','$2b$10$rZ.MXsB3t3BxHMaQvGypRu8jF5R6D9eib2yFi.U.YpXKVMxWr.Wky');
COMMIT;
