# SoundWave 🎵

[![en](https://img.shields.io/badge/lang-English-blue.svg)](README.en.md)
[![mn](https://img.shields.io/badge/lang-Монгол-red.svg)](README.mn.md)
[![jp](https://img.shields.io/badge/lang-日本語-green.svg)](README.md)

## Төслийн тухай
SoundWave нь орчин үеийн веб технологи ашиглан бүтээсэн хөгжмийн урсгал платформ юм. Хэрэглэгчид хөгжим байршуулах, хуваалцах, тоглуулах боломжтой бөгөөд түүнчлэн тоглуулах жагсаалт үүсгэх, дуртай дуунуудаа хуваалцах боломжтой.

## Үндсэн боломжууд
- 🎵 Хөгжим байршуулах, тоглуулах
- 👤 Хэрэглэгчийн баталгаажуулалт (Нэвтрэх/Бүртгүүлэх)
- ❤️ Дуртай дуунуудаа хадгалах
- 📝 Тоглуулах жагсаалт үүсгэх, удирдах
- 🔍 Хөгжим хайх
- 🔥 Трэнд дуунуудыг харуулах
- 📱 Хариу үйлдэл үзүүлэх дизайн

## Технологийн багц
- **Frontend**: Next.js 13, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **UI сан**: Radix UI, Lucide Icons
- **Төлөвийн удирдлага**: Zustand
- **Загвар**: Tailwind CSS, shadcn/ui

## Хөгжүүлэлтийн орчин бэлтгэх

### Шаардлагатай зүйлс
- Node.js 18.x буюу түүнээс дээш
- npm 9.x буюу түүнээс дээш
- Firebase төсөл

### Суулгах алхамууд
1. Repository-г clone хийх:
```bash
git clone https://github.com/tushig666/soundwave.git
cd soundwave
```

2. Хамаарлуудыг суулгах:
```bash
npm install
```

3. Орчны хувьсагчдыг тохируулах:
`.env.local` файл үүсгэж дараах хувьсагчдыг тохируулна:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Хөгжүүлэлтийн серверийг эхлүүлэх:
```bash
npm run dev
```

Сервер эхэлсний дараа `http://localhost:9002` хаягаар аппликейшнд хандах боломжтой.

## Үндсэн боломжуудын тайлбар

### Баталгаажуулалт
- Firebase ашиглан хэрэглэгчийн баталгаажуулалт
- Нэвтрэх/Бүртгүүлэх/Гарах үйлдэл
- Профайл удирдлага

### Хөгжмийн удирдлага
- Хөгжмийн файл байршуулах (MP3 формат)
- Хөгжим тоглуулах, түр зогсоох, алгасах
- Тоглуулах жагсаалт үүсгэх, засварлах
- Дуртай дуунуудын удирдлага

### Хайлт ба нээлт
- Дууны нэрээр хайх
- Трэнд дуунуудыг харуулах
- Төрлөөр нь үзэх

### UI/UX
- Орчин үеийн, ойлгомжтой интерфэйс
- Хариу үйлдэл үзүүлэх дизайн
- Харанхуй горимын дэмжлэг

## Байршуулалт

### Netlify дээр байршуулах алхамууд
1. Netlify бүртгэл үүсгэх
2. GitHub repository-тэй холбох
3. Орчны хувьсагчдыг тохируулах
4. Байршуулалтын тохиргоог хийх
5. Build хийж байршуулах

## Хувь нэмэр оруулах
1. Энэ repository-г fork хийх
2. Шинэ салбар үүсгэх (`git checkout -b feature/amazing-feature`)
3. Өөрчлөлтүүдээ commit хийх (`git commit -m 'Add amazing feature'`)
4. Салбар руу push хийх (`git push origin feature/amazing-feature`)
5. Pull Request үүсгэх

## Лиценз
MIT License
