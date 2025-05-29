import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
 
interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
 
@Component({
  selector: 'app-ai-chat-popup',
  templateUrl: './ai-chat-popup.component.html',
  styleUrls: ['./ai-chat-popup.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule]
})
export class AiChatPopupComponent {
  @Input() userId: number | null = null;
  @Output() close = new EventEmitter<void>();
 
  messages: ChatMessage[] = [];
  userInput: string = '';
  loading: boolean = false;
  error: string = '';
  suggestions: string[] = [];

   // Initial suggestions
   initialSuggestions = [
    "How many stocks do i own?",
    "Analyse my portfolio?",
    "Should I diversify more?",
    "Explain bond yields",
    "What is the current market trend?",
  ];

  ngOnInit() {
    this.suggestions = this.initialSuggestions;
  }
  selectSuggestion(suggestion: string) {
    this.userInput = suggestion;
    this.sendMessage();
  }
 
  constructor(private http: HttpClient) {}
 
  sendMessage() {
    if (!this.userInput.trim()) return;
    const question = this.userInput.trim();
    this.messages.push({ sender: 'user', text: question });
    this.userInput = '';
    this.loading = true;
    this.error = '';
 
    // Prepare payload (send userId only if present)
    const payload: any = { question };
    if (this.userId) payload.userId = this.userId;
 
    // this.http.post<{ answer: string }>('http://localhost:5154/api/AskAi', payload).subscribe({
    //   next: (res) => {
    //     this.messages.push({ sender: 'ai', text: res.answer });
    //     this.loading = false;
    //   },
    this.http.post<{ answer: string, suggestions: string[] }>('http://localhost:5154/api/AskAi', payload).subscribe({
      next: (res) => {
        this.messages.push({ sender: 'ai', text: res.answer });
        this.suggestions = res.suggestions?.length > 0 
          ? res.suggestions 
          : this.initialSuggestions;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Sorry, something went wrong. Please try again.';
        this.loading = false;
      }
    });
  }
 
  onClose() {
    this.close.emit();
  }
}
 
 