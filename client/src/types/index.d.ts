declare global {

    var BASE_URL: string;

    interface Project {
        _id: string;
        name: string;
        userId: string;
        designs: Design[];
        createdAt: Date;
        updatedAt: Date;
    }

    interface Design {
        _id: string;
        prompt: string;
        imageUrl: string;
        userId: string;
        project: string | Project;
        createdAt: Date;
        updatedAt: Date;
    }
}

export {};