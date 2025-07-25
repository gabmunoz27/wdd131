# passwords.py
# Gabriel Muñoz - CSE111

# 2 Features added History passwords - tips

LOWER=["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
UPPER=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
DIGITS=["0","1","2","3","4","5","6","7","8","9"]
SPECIAL=["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", "|", ";", ":", """, """, ",", ".", "<", ">", "?", "/", "`", "~"]

def word_in_file(word, filename, case_sensitive=False):
    """This function reads a file (specified by the filename parameter) in which each line
    of the file contains a single word. If the word passed in the word parameter matches a word
    in the file the function returns a true otherwise it returns a false. If the parameter
    case_sensitive is true a case sensitive match is performed. If case_sensitive is false
    a case insensitive match is performed. The case_sensitive parameter should default to False"""
    try:
        with open(filename, "r", encoding="utf-8") as file:
            for line in file:
                line_word = line.strip()
                if case_sensitive:
                    if word == line_word:
                        return True
                else:
                    if word.lower() == line_word.lower():
                        return True
    except FileNotFoundError:
        print(f"{filename} not found.")
    return False

def word_has_character(word, character_list):
    """This function loops through each character in the string passed
     in the word parameter to see if that character is in the list of
     characters passed in the character_list parameter. If any of the 
     characters in the word are present in the character list return a 
     true, If none of the characters in the word are in the character list return false"""
    for same_character in word:
        if same_character in character_list:
            return True
    return False

def word_complexity(word):
    """This function creates a numeric complexity value based on the types of characters
    the word parameter contains. One point of complexity is given for each type of character
    in the word. The function calls the word_has_character function for each of the 4 kinds
    of characters (LOWER, UPPER, DIGITS, SPECIAL). If the word has that kind of character
    a point is added to complexity rating. Since there are 4 kinds of characters the 
    complexity rating will range from 0 to 4. (0 would be returned only if word contained
    no characters or only contains characters that are not in any of the lists.)"""
    complexity = 0
    if word_has_character(word, LOWER):
        complexity += 1
    if word_has_character(word, UPPER):
        complexity += 1
    if word_has_character(word, DIGITS):
        complexity += 1
    if word_has_character(word, SPECIAL):
        complexity += 1
    return complexity

def password_strength(password, min_length=10, strong_length=16):
    """This function checks length requirements, calls word_complexity to calculate the words
      complexity then determines the password's strength based on the user requirements. 
      It should print the messages defined in the requirements and return the password's 
      strength as a number from 0 to 5. The min_length parameter should have a default value 
      of 10. The strong_length parameter should have a default value of 16"""
    if word_in_file(password, "wordlist.txt", case_sensitive=False):
        print("Password is a dictionary word and is not secure.")
        return 0

    if word_in_file(password, "toppasswords.txt", case_sensitive=True):
        print("Password is a commonly used password and is not secure.")
        return 0

    if len(password) < min_length:
        print("Password is too short and is not secure.")
        return 1

    if len(password) >= strong_length:
        print("Password is long, length trumps complexity this is a good password.")
        return 5

    complexity = word_complexity(password)
    strength = 1 + complexity
    return strength

def main():
    """Provides the user input loop. The loop asks the user for a password to test.
    If that password is anything but "q" or "Q" call the password_strength function and
    report the results to the user. If the user enters "q" or "Q", quit the program."""
    print("Password Strength Check")
    print("Enter 'q' to quit.")

    while True:
        password = input("Enter a password to test: ")
        if password.lower() == 'q':
            print("Come back whenever you need.")
            break
        strength = password_strength(password)
        print(f"Password Strength: {strength}/5\n")

        # Feature add 1: History file
        with open("history.txt", "a", encoding="utf-8") as history_file:
            history_file.write(f"{password} - Strength: {strength}/5\n")

        # Feature add 2: Suggest improvements
        if strength < 5:
            print("Tip: Try add some uppercase, lowercase, digits, and special characters.")
            if len(password) < 16:
                print("You can use a larger password with more than 15 characters.")

if __name__ == "__main__":
    main()