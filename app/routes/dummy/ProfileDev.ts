interface ProfileProps {
    name: string;
    email: string;
    phoneNumber: string;
}

class Profile {
    profileList: ProfileProps;
    constructor({ name, email, phoneNumber }: ProfileProps) {
        this.profileList = {
            name,
            email,
            phoneNumber
        };
    };

    public getProfileList() {
        return this.profileList;
    }

    public setProfileList({ name, email, phoneNumber }: ProfileProps) {
        this.profileList = {
            name,
            email,
            phoneNumber
        }

    }
}

const ProfileProvider = new Profile({
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "1234567890"
});

export { ProfileProvider };
