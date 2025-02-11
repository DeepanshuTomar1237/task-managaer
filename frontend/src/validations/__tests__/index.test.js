import validate from '../index';  // Adjust the import based on your folder structure
import validateManyFields from '../index';

describe('Validation Tests', () => {
  // Test the "signup" group
  describe('Signup Group Validation', () => {
    it('should return error for empty name', () => {
      const result = validate('signup', 'name', '');
      expect(result).toBe('This field is required');
    });

    it('should return error for invalid email', () => {
      const result = validate('signup', 'email', 'invalidemail');
      expect(result).toBe('Please enter valid email address');
    });

    it('should return error for password less than 4 characters', () => {
      const result = validate('signup', 'password', '123');
      expect(result).toBe('Password should be atleast 4 chars long');
    });

    it('should return null for valid fields', () => {
      const nameResult = validate('signup', 'name', 'John Doe');
      const emailResult = validate('signup', 'email', 'johndoe@example.com');
      const passwordResult = validate('signup', 'password', 'password123');

      expect(nameResult).toBeNull();
      expect(emailResult).toBeNull();
      expect(passwordResult).toBeNull();
    });
  });

  // Test the "login" group
  describe('Login Group Validation', () => {
    it('should return error for empty email', () => {
      const result = validate('login', 'email', '');
      expect(result).toBe('This field is required');
    });

    it('should return error for invalid email format', () => {
      const result = validate('login', 'email', 'invalidemail');
      expect(result).toBe('Please enter valid email address');
    });

    it('should return null for valid email', () => {
      const result = validate('login', 'email', 'johndoe@example.com');
      expect(result).toBeNull();
    });

    it('should return null for password', () => {
      const result = validate('login', 'password', 'password123');
      expect(result).toBeNull();
    });
  });

  // Test the "task" group
  describe('Task Group Validation', () => {
    it('should return error for empty description', () => {
      const result = validate('task', 'description', '');
      expect(result).toBe('This field is required');
    });

    it('should return error for description length greater than 100', () => {
      const result = validate('task', 'description', 'a'.repeat(101));
      expect(result).toBe('Max. limit is 100 characters.');
    });

    it('should return null for valid description', () => {
      const result = validate('task', 'description', 'Valid task description');
      expect(result).toBeNull();
    });
  });

  // Test the validateManyFields function
  describe('validateManyFields function', () => {
    it('should return an array of errors for invalid fields', () => {
      const formData = {
        name: '',
        email: 'invalidemail',
        password: '123',
      };
      const errors = validateManyFields('signup', formData);
      expect(errors).toEqual([
        { field: 'name', err: 'This field is required' },
        { field: 'email', err: 'Please enter valid email address' },
        { field: 'password', err: 'Password should be atleast 4 chars long' },
      ]);
    });

    it('should return an empty array for valid fields', () => {
      const formData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };
      const errors = validateManyFields('signup', formData);
      expect(errors).toEqual([]);
    });
  });
});
