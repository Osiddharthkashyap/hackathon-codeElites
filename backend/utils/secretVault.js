import crypto from "crypto";

const algorithm = "aes-256-gcm";

const getKey = () => {
    const secret = process.env.CREDENTIAL_ENCRYPTION_KEY;
    if (!secret || secret.length < 32) throw new Error("CREDENTIAL_ENCRYPTION_KEY must be at least 32 characters.");
    return crypto.createHash("sha256").update(secret).digest();
};

export const encryptSecret = (value) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
    return `${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${encrypted.toString("hex")}`;
};

export const decryptSecret = (value) => {
    const [ivHex, tagHex, encryptedHex] = String(value).split(":");
    const decipher = crypto.createDecipheriv(algorithm, getKey(), Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    return Buffer.concat([decipher.update(Buffer.from(encryptedHex, "hex")), decipher.final()]).toString("utf8");
};
