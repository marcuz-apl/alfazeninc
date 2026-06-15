# Docker Build & Push Guide for Synology NAS

Building Docker images on a low-power Synology NAS can be painfully slow (especially when compiling C++ dependencies like SQLite). The industry-standard approach is to use your powerful local PC/Mac to build the image, push it to a registry (like Docker Hub), and simply download the finished image on your NAS.

Here is exactly how to do it.

---

## 1. Prerequisites on your Local PC

Before you begin, make sure you have installed Docker Desktop on your computer and created a free account on [Docker Hub](https://hub.docker.com/).

Open your terminal (or Command Prompt) and log in to Docker:
```bash
docker login
```
*(Enter your Docker Hub username and password when prompted.)*

---

## 2. Build for the Correct Architecture (Crucial!)

Your local PC might use an Apple Silicon chip (ARM64) or an Intel/AMD chip (AMD64). Your Synology NAS almost certainly uses an **Intel/AMD (linux/amd64)** chip (e.g., Celeron). 

If you build an image on an M1/M2/M3 Mac normally, it will fail to run on the Synology NAS. You must tell Docker to explicitly build it for the NAS's architecture.

Run this command inside your project folder (where the `Dockerfile` is):

```bash
docker buildx build --platform linux/amd64 -t yourdockerusername/alfazen-web:latest .
```
- Replace `yourdockerusername` with your actual Docker Hub username.
- The `.` at the end tells Docker to use the current directory.

---

## 3. Push the Image to Docker Hub

Once the build is finished, push the compiled image up to the cloud:

```bash
docker push yourdockerusername/alfazen-web:latest
```

*(This will upload the image to a public repository on your Docker Hub account. If you want it to be private, you can set the repository to private in your Docker Hub account settings online).*

---

## 4. Run it on the Synology NAS

Now that the heavy lifting is done, head over to your Synology NAS!

1. Open **Container Manager** (or Docker).
2. Go to the **Registry** tab.
3. Search for `yourdockerusername/alfazen-web`.
4. Double click it to download the `latest` tag. (This will download instantly, no compiling required!)
5. Go to the **Image** tab, select the downloaded image, and click **Run**.
6. Map your ports (e.g., 2038 to 2038) and map your Volumes:
   - Map a folder on your NAS (e.g., `/docker/alfazen/data`) to `/app/data`
   - Map a folder for images (e.g., `/docker/alfazen/images`) to `/app/public/images`

Start the container, and your app will boot instantly!

---

## 5. Troubleshooting: "Database Error" (Volume Permissions)

If you get a **"Database Error"** pop-up when modifying settings or submitting forms in the CMS Dashboard, this is due to a permission mismatch between the Synology host folder and the container.

Inside the container, the Next.js application runs as a non-root user (`nextjs` with UID `1001`). If the host folders mapped to `/app/data` and `/app/public/images` are owned by `root` or another user, the application will not be able to write to the SQLite database.

### Solution

To resolve this issue:

1. **SSH into your Synology NAS**.
2. Navigate to the directory containing your mounted volume folders (e.g., `/volume1/docker/alfazen` or the directory with your `docker-compose.yml`).
3. Set the ownership of the mounted directories to UID `1001` (the user inside the container) and grant permissions:
   ```bash
   sudo chown -R 1001:1001 ./data ./public/images
   sudo chmod -R 775 ./data ./public/images
   ```
4. Restart the container to apply the permission changes:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

