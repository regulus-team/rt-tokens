// functions/src/index.ts (or functions/index.js)
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';

admin.initializeApp();

export const signJwt = functions.https.onRequest(async (req, res) => {
  try {
    // Verify Firebase Auth token
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      res.status(401).send({error: 'Unauthorized'});
      return;
    }
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Create a JWT
    const payload = {uid: decodedToken.uid, email: decodedToken.email};
    const secret = 'your-secret-key';
    const jwtToken = jwt.sign(payload, secret, {expiresIn: '1h'});

    res.status(200).send({token: jwtToken});
  } catch (error) {
    res.status(500).send({error: 'Unable to sign JWT', nativeError: error});
  }
});
