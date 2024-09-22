import jwt from 'jsonwebtoken'

const SECRET = process.env.SECRET

const decodeUserFromToken = (req, res, next) => {
  let token = req.get('Authorization') || req.query.token || req.body.token
  if (!token) return next()

  token = token.replace('Bearer ', '')
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return next(err)

    req.user = decoded.user
    next()
  })
}

function checkAuth(req, res, next) {
  return req.user ? next() : res.status(401).json({ err: 'Not Authorized' }) 
}

function checkAdmin(req, res, next) {
  if (req.user && req.user.profile.authorizationLevel === 101) {
    return next()
  } else {
    return res.status(403).json({ err: 'Forbidden: Admins only' })
  }
}

function checkStoreOwner(req, res, next) {
  if (req.user && req.user.profile.authorizationLevel >= 200 && req.user.profile.authorizationLevel <= 299) {
    return next()
  } else {
    return res.status(403).json({ err: 'Forbidden: Store Owners only' })
  }
}

function checkPatron(req, res, next) {
  if (req.user && req.user.profile.authorizationLevel < 200) {
    return next()
  } else {
    return res.status(403).json({ err: 'Forbidden: Patrons only' })
  }
}

function checkAdminOrStoreOwner(req, res, next) {
  if (req.user && (req.user.profile.authorizationLevel === 101 || 
                   (req.user.profile.authorizationLevel >= 200 && req.user.profile.authorizationLevel <= 299))) {
    return next()
  } else {
    return res.status(403).json({ err: 'Forbidden: Admins or Store Owners only' })
  }
}

function checkAdminOrPatron(req, res, next) {
  if (req.user && (req.user.profile.authorizationLevel === 101 || 
                   req.user.profile.authorizationLevel < 200)) {
    return next()
  } else {
    return res.status(403).json({ err: 'Forbidden: Admins or Patrons only' })
  }
}


export { decodeUserFromToken, checkAuth, checkAdmin, checkStoreOwner, checkPatron, checkAdminOrStoreOwner, checkAdminOrPatron }
