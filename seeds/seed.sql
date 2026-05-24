-- Passwords are bcrypt hashes of '12345678'  (salt rounds = 10)
INSERT INTO users (name, email, password, role) VALUES
  (
    'Alice Maintainer',
    'alice@devpulse.com',
    '$2a$12$77BrV0X47e48avlszs5yP.Awes35bQliTSmkVVveUkfei5Hr50Cg.',
    'maintainer'
  ),
  (
    'Bob Contributor',
    'bob@devpulse.com',
    '$2a$12$77BrV0X47e48avlszs5yP.Awes35bQliTSmkVVveUkfei5Hr50Cg.',
    'contributor'
  ),
  (
    'Carol Contributor',
    'carol@devpulse.com',
    '$2a$12$77BrV0X47e48avlszs5yP.Awes35bQliTSmkVVveUkfei5Hr50Cg.',
    'contributor'
  )
ON CONFLICT (email) DO NOTHING;

INSERT INTO issues (title, description, type, status, reporter_id) VALUES
  (
    'Database connection timeout under load',
    'Pool exhausts after 50+ concurrent queries, causing 500 errors on the API gateway.',
    'bug',
    'open',
    (SELECT id FROM users WHERE email = 'bob@devpulse.com')
  ),
  (
    'Add dark mode to dashboard',
    'Users have requested a dark mode toggle in the main dashboard settings panel for better usability.',
    'feature_request',
    'in_progress',
    (SELECT id FROM users WHERE email = 'carol@devpulse.com')
  ),
  (
    'Login fails with special characters in password',
    'Passwords containing characters like &, %, and # cause a 400 error during login due to improper encoding.',
    'bug',
    'resolved',
    (SELECT id FROM users WHERE email = 'bob@devpulse.com')
  )
ON CONFLICT DO NOTHING;
